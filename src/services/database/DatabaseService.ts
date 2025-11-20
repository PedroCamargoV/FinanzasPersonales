/**
 * DatabaseService - Core IndexedDB operations
 *
 * Provides abstraction layer for all database operations including:
 * - Database initialization and schema management
 * - CRUD operations (Create, Read, Update, Delete)
 * - Query operations with indexing
 * - Transaction management
 * - Error handling and logging
 */

import { getCurrentTimestamp } from '@/utils/date'
import { performanceTracker } from '@/utils/performance'
import { PERFORMANCE_TARGETS } from '@/utils/constants'
import {
  DBConfig,
  DBInitOptions,
  DBOperationResult,
  DBQueryFilter,
  DBConnection,
  DBInitStatus,
  DatabaseError,
  ErrorCode,
} from '@/types'

/**
 * DatabaseService - Manages all IndexedDB operations
 */
export class DatabaseService {
  private static instance: IDBDatabase | null = null
  private static status: DBInitStatus = 'uninitialized'
  private static initPromise: Promise<IDBDatabase> | null = null

  /**
   * Initialize the database
   */
  static async initialize(
    _config?: DBConfig,
    options?: DBInitOptions
  ): Promise<IDBDatabase> {
    // Return existing promise if initialization is in progress
    if (this.initPromise) {
      return this.initPromise
    }

    // Return existing instance if already initialized
    if (this.instance && this.status === 'ready') {
      return this.instance
    }

    // Create new initialization promise
    this.initPromise = this._performInitialization(_config, options)

    try {
      this.instance = await this.initPromise
      this.status = 'ready'
      return this.instance
    } catch (error) {
      this.status = 'failed'
      this.initPromise = null
      throw error
    }
  }

  /**
   * Perform actual database initialization
   */
  private static async _performInitialization(
    _config?: DBConfig,
    options?: DBInitOptions
  ): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      this.status = 'initializing'

      // Use provided config or create default
      const dbConfig = _config || this._createDefaultConfig()

      // Open/create database
      const request = indexedDB.open(dbConfig.name, dbConfig.version)

      // Handle version change (schema creation/migration)
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores if needed
        for (const storeConfig of dbConfig.stores) {
          // Delete and recreate if force recreation is requested
          if (options?.forceRecreate && db.objectStoreNames.contains(storeConfig.name)) {
            db.deleteObjectStore(storeConfig.name)
          }

          // Create object store if it doesn't exist
          if (!db.objectStoreNames.contains(storeConfig.name)) {
            const store = db.createObjectStore(storeConfig.name, {
              keyPath: storeConfig.keyPath,
            })

            // Create indexes
            if (storeConfig.indexes) {
              for (const indexConfig of storeConfig.indexes) {
                store.createIndex(
                  indexConfig.name,
                  indexConfig.keyPath,
                  indexConfig.options
                )
              }
            }
          }
        }

        // Call custom upgrade handler if provided
        if (options?.onUpgrade) {
          options.onUpgrade(event as IDBVersionChangeEvent).catch((err: unknown) => {
            reject(
              new DatabaseError({
                code: ErrorCode.DB_CONNECTION_FAILED,
                message: 'Custom upgrade handler failed',
                context: { error: err instanceof Error ? err.message : String(err) },
                operation: 'transaction',
                storeName: 'all',
              })
            )
          })
        }
      }

      // Handle successful connection
      request.onsuccess = () => {
        const db = request.result
        resolve(db)
      }

      // Handle connection error
      request.onerror = () => {
        reject(
          new DatabaseError({
            code: ErrorCode.DB_CONNECTION_FAILED,
            message: `Failed to connect to database "${dbConfig.name}"`,
            context: { error: request.error?.message },
            operation: 'transaction',
            storeName: 'all',
          })
        )
      }

      // Handle blocked connection
      request.onblocked = () => {
        console.warn(
          `Database "${dbConfig.name}" connection is blocked. Close other tabs to continue.`
        )
      }
    })
  }

  /**
   * Create default database configuration
   */
  private static _createDefaultConfig(): DBConfig {
    return {
      name: 'finanzas-personales',
      version: 2,
      stores: [
        {
          name: 'transactions',
          keyPath: 'id',
          indexes: [
            { name: 'date', keyPath: 'date', options: { unique: false } },
            { name: 'category', keyPath: 'category', options: { unique: false } },
            { name: 'type', keyPath: 'type', options: { unique: false } },
          ],
        },
        {
          name: 'categories',
          keyPath: 'id',
          indexes: [
            { name: 'type', keyPath: 'type', options: { unique: false } },
            {
              name: 'parentCategory',
              keyPath: 'parentCategory',
              options: { unique: false },
            },
          ],
        },
        {
          name: 'recurring_transactions',
          keyPath: 'id',
          indexes: [
            { name: 'type', keyPath: 'type', options: { unique: false } },
            { name: 'category', keyPath: 'category', options: { unique: false } },
            { name: 'isActive', keyPath: 'isActive', options: { unique: false } },
          ],
        },
      ],
    }
  }

  /**
   * Get current database connection status
   */
  static getStatus(): DBInitStatus {
    return this.status
  }

  /**
   * Get database connection info
   */
  static getConnection(): DBConnection | null {
    if (!this.instance) {
      return null
    }

    return {
      db: this.instance,
      status: this.status,
      version: this.instance.version,
      storeNames: Array.from(this.instance.objectStoreNames),
      error: this.status === 'failed' ? new Error('Database initialization failed') : null,
    }
  }

  /**
   * Create a new record in a store
   */
  static async create<T extends Record<string, unknown>>(
    storeName: string,
    data: T
  ): Promise<DBOperationResult<string>> {
    performanceTracker.start(`db_create_${storeName}`)

    try {
      await this._ensureInitialized()
      const timestamp = getCurrentTimestamp()

      // Add timestamps
      const dataWithTimestamps = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      const result = await this._executeTransaction<string>(
        storeName,
        'readwrite',
        (store) => {
          return new Promise((resolve, reject) => {
            const request = store.add(dataWithTimestamps)
            request.onsuccess = () => resolve(request.result as string)
            request.onerror = () => reject(request.error)
          })
        }
      )

      performanceTracker.end(
        `db_create_${storeName}`,
        PERFORMANCE_TARGETS.DB_OPERATION_CREATE
      )

      return {
        success: true,
        data: result,
        timestamp,
        duration: 0,
      }
    } catch (error) {
      performanceTracker.end(`db_create_${storeName}`)
      throw error
    }
  }

  /**
   * Read a record by ID
   */
  static async getById<T>(
    storeName: string,
    id: IDBValidKey
  ): Promise<DBOperationResult<T | null>> {
    performanceTracker.start(`db_read_${storeName}`)

    try {
      await this._ensureInitialized()
      const timestamp = getCurrentTimestamp()

      const result = await this._executeTransaction<T | undefined>(
        storeName,
        'readonly',
        (store) => {
          return new Promise((resolve, reject) => {
            const request = store.get(id)
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
          })
        }
      )

      performanceTracker.end(`db_read_${storeName}`, PERFORMANCE_TARGETS.DB_OPERATION_READ)

      return {
        success: true,
        data: result ?? null,
        timestamp,
        duration: 0,
      }
    } catch (error) {
      performanceTracker.end(`db_read_${storeName}`)
      throw error
    }
  }

  /**
   * Get all records from a store
   */
  static async getAll<T>(storeName: string): Promise<DBOperationResult<T[]>> {
    performanceTracker.start(`db_getAll_${storeName}`)

    try {
      await this._ensureInitialized()
      const timestamp = getCurrentTimestamp()

      const results = await this._executeTransaction<T[]>(
        storeName,
        'readonly',
        (store) => {
          return new Promise((resolve, reject) => {
            const request = store.getAll()
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
          })
        }
      )

      performanceTracker.end(
        `db_getAll_${storeName}`,
        PERFORMANCE_TARGETS.DB_OPERATION_QUERY
      )

      return {
        success: true,
        data: results,
        timestamp,
        duration: 0,
      }
    } catch (error) {
      performanceTracker.end(`db_getAll_${storeName}`)
      throw error
    }
  }

  /**
   * Query records using an index
   */
  static async query<T>(
    storeName: string,
    indexName: string,
    value: IDBValidKey,
    filter?: DBQueryFilter
  ): Promise<DBOperationResult<T[]>> {
    performanceTracker.start(`db_query_${storeName}_${indexName}`)

    try {
      await this._ensureInitialized()
      const timestamp = getCurrentTimestamp()

      const results = await this._executeTransaction<T[]>(
        storeName,
        'readonly',
        (store) => {
          return new Promise((resolve, reject) => {
            const index = store.index(indexName)
            const request = index.getAll(value)

            request.onsuccess = () => {
              let records = request.result as T[]

              // Apply offset
              if (filter?.offset) {
                records = records.slice(filter.offset)
              }

              // Apply limit
              if (filter?.limit) {
                records = records.slice(0, filter.limit)
              }

              resolve(records)
            }

            request.onerror = () => reject(request.error)
          })
        }
      )

      performanceTracker.end(
        `db_query_${storeName}_${indexName}`,
        PERFORMANCE_TARGETS.DB_OPERATION_QUERY
      )

      return {
        success: true,
        data: results,
        timestamp,
        duration: 0,
      }
    } catch (error) {
      performanceTracker.end(`db_query_${storeName}_${indexName}`)
      throw error
    }
  }

  /**
   * Update a record
   */
  static async update<T extends Record<string, unknown>>(
    storeName: string,
    id: IDBValidKey,
    updates: Partial<T>
  ): Promise<DBOperationResult<void>> {
    performanceTracker.start(`db_update_${storeName}`)

    try {
      await this._ensureInitialized()
      const timestamp = getCurrentTimestamp()

      // Get existing record
      const existing = await this._executeTransaction<T | undefined>(
        storeName,
        'readonly',
        (store) => {
          return new Promise((resolve, reject) => {
            const request = store.get(id)
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
          })
        }
      )

      if (!existing) {
        throw new DatabaseError({
          code: ErrorCode.DB_NOT_FOUND,
          message: `Record not found in store "${storeName}"`,
          operation: 'update',
          storeName,
          key: id,
        })
      }

      // Merge updates with timestamps
      const updated = {
        ...existing,
        ...updates,
        updatedAt: timestamp,
      }

      await this._executeTransaction<void>(storeName, 'readwrite', (store) => {
        return new Promise((resolve, reject) => {
          const request = store.put(updated)
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      })

      performanceTracker.end(
        `db_update_${storeName}`,
        PERFORMANCE_TARGETS.DB_OPERATION_UPDATE
      )

      return {
        success: true,
        data: undefined,
        timestamp,
        duration: 0,
      }
    } catch (error) {
      performanceTracker.end(`db_update_${storeName}`)
      throw error
    }
  }

  /**
   * Delete a record
   */
  static async delete(
    storeName: string,
    id: IDBValidKey
  ): Promise<DBOperationResult<void>> {
    performanceTracker.start(`db_delete_${storeName}`)

    try {
      await this._ensureInitialized()
      const timestamp = getCurrentTimestamp()

      await this._executeTransaction<void>(storeName, 'readwrite', (store) => {
        return new Promise((resolve, reject) => {
          const request = store.delete(id)
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      })

      performanceTracker.end(
        `db_delete_${storeName}`,
        PERFORMANCE_TARGETS.DB_OPERATION_DELETE
      )

      return {
        success: true,
        data: undefined,
        timestamp,
        duration: 0,
      }
    } catch (error) {
      performanceTracker.end(`db_delete_${storeName}`)
      throw error
    }
  }

  /**
   * Clear all records from a store
   */
  static async clear(storeName: string): Promise<DBOperationResult<void>> {
    try {
      await this._ensureInitialized()
      const timestamp = getCurrentTimestamp()

      await this._executeTransaction<void>(storeName, 'readwrite', (store) => {
        return new Promise((resolve, reject) => {
          const request = store.clear()
          request.onsuccess = () => resolve()
          request.onerror = () => reject(request.error)
        })
      })

      return {
        success: true,
        data: undefined,
        timestamp,
        duration: 0,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Execute a transaction on a store
   */
  private static async _executeTransaction<T>(
    storeName: string,
    mode: 'readonly' | 'readwrite',
    callback: (store: IDBObjectStore) => Promise<T>
  ): Promise<T> {
    const db = await this._ensureInitialized()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], mode)
      const store = transaction.objectStore(storeName)

      let result: T

      // Execute callback
      callback(store)
        .then((res) => {
          result = res
        })
        .catch((error) => {
          transaction.abort()
          reject(
            new DatabaseError({
              code: ErrorCode.DB_TRANSACTION_FAILED,
              message: 'Transaction execution failed',
              context: { error: error instanceof Error ? error.message : String(error) },
              operation: mode === 'readwrite' ? 'update' : 'read',
              storeName,
            })
          )
        })

      // Handle transaction completion
      transaction.oncomplete = () => resolve(result)
      transaction.onerror = () => {
        reject(
          new DatabaseError({
            code: ErrorCode.DB_TRANSACTION_FAILED,
            message: `Database transaction failed: ${transaction.error?.message}`,
            operation: mode === 'readwrite' ? 'update' : 'read',
            storeName,
          })
        )
      }
    })
  }

  /**
   * Ensure database is initialized
   */
  private static async _ensureInitialized(): Promise<IDBDatabase> {
    if (this.instance && this.status === 'ready') {
      return this.instance
    }

    if (this.status === 'initializing' && this.initPromise) {
      return this.initPromise
    }

    throw new DatabaseError({
      code: ErrorCode.DB_NOT_INITIALIZED,
      message: 'Database is not initialized. Call initialize() first.',
      operation: 'read',
      storeName: 'unknown',
    })
  }

  /**
   * Close database connection
   */
  static close(): void {
    if (this.instance) {
      this.instance.close()
      this.instance = null
      this.status = 'uninitialized'
      this.initPromise = null
    }
  }
}
