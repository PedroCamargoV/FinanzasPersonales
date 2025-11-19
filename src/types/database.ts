/**
 * Database configuration for IndexedDB setup
 *
 * @example
 * const dbConfig: DBConfig = {
 *   name: "finanzas-personales",
 *   version: 1,
 *   stores: [
 *     {
 *       name: "transactions",
 *       keyPath: "id",
 *       indexes: [
 *         { name: "date", keyPath: "date", options: { unique: false } },
 *         { name: "category", keyPath: "category", options: { unique: false } }
 *       ]
 *     }
 *   ]
 * }
 */
export interface DBConfig {
  /** Database name */
  name: string

  /** Database schema version */
  version: number

  /** Object stores configuration */
  stores: DBStoreConfig[]
}

/**
 * Configuration for an IndexedDB object store
 *
 * @example
 * const storeConfig: DBStoreConfig = {
 *   name: "transactions",
 *   keyPath: "id",
 *   indexes: [
 *     { name: "date", keyPath: "date", options: { unique: false } }
 *   ]
 * }
 */
export interface DBStoreConfig {
  /** Object store name (usually plural) */
  name: string

  /** Primary key path (usually "id") */
  keyPath: string

  /** Index configurations for the store */
  indexes?: DBIndexConfig[]
}

/**
 * Configuration for an IndexedDB index
 *
 * @example
 * const indexConfig: DBIndexConfig = {
 *   name: "date",
 *   keyPath: "date",
 *   options: { unique: false }
 * }
 */
export interface DBIndexConfig {
  /** Index name (for querying) */
  name: string

  /** Property path to index */
  keyPath: string | string[]

  /** Index options (unique, multiEntry) */
  options?: IDBIndexParameters
}

/**
 * Database transaction context (read-only or read-write)
 */
export type DBTransactionMode = 'readonly' | 'readwrite' | 'versionchange'

/**
 * Database operation result with metadata
 *
 * @example
 * const result: DBOperationResult<Transaction> = {
 *   success: true,
 *   data: transaction,
 *   timestamp: "2024-01-01T00:00:00Z",
 *   duration: 23
 * }
 */
export interface DBOperationResult<T = unknown> {
  /** Operation success status */
  success: boolean

  /** Operation result data (null if failed) */
  data: T | null

  /** Operation timestamp (ISO 8601) */
  timestamp: string

  /** Operation duration in milliseconds */
  duration: number

  /** Error message if failed */
  error?: string
}

/**
 * Batch operation result for bulk operations
 *
 * @example
 * const result: DBBatchOperationResult<Transaction> = {
 *   success: true,
 *   successCount: 95,
 *   failureCount: 5,
 *   results: [...]
 * }
 */
export interface DBBatchOperationResult<T = unknown> {
  /** Overall operation success */
  success: boolean

  /** Number of successful operations */
  successCount: number

  /** Number of failed operations */
  failureCount: number

  /** Individual operation results */
  results: DBOperationResult<T>[]

  /** Total operation duration in milliseconds */
  duration: number
}

/**
 * Database initialization options
 */
export interface DBInitOptions {
  /** Force database recreation (delete and recreate) */
  forceRecreate?: boolean

  /** Migration function for version updates */
  onUpgrade?: (event: IDBVersionChangeEvent) => Promise<void>

  /** Timeout for database operations in milliseconds (default: 5000) */
  timeout?: number
}

/**
 * Database query filter options
 */
export interface DBQueryFilter {
  /** Index to query on */
  index?: string

  /** Query key or key range */
  key?: IDBValidKey | IDBKeyRange

  /** Sort direction */
  direction?: 'next' | 'nextunique' | 'prev' | 'prevunique'

  /** Maximum number of results (null = all) */
  limit?: number | null

  /** Number of results to skip */
  offset?: number
}

/**
 * Database store names enum (for type safety)
 */
export enum DBStoreName {
  TRANSACTIONS = 'transactions',
  CATEGORIES = 'categories',
  BUDGETS = 'budgets',
  SETTINGS = 'settings',
}

/**
 * Database initialization status
 */
export type DBInitStatus = 'uninitialized' | 'initializing' | 'ready' | 'failed'

/**
 * Database connection context
 */
export interface DBConnection {
  /** Database instance */
  db: IDBDatabase

  /** Current status */
  status: DBInitStatus

  /** Database version */
  version: number

  /** Store names available */
  storeNames: string[]

  /** Last error (if any) */
  error: Error | null
}
