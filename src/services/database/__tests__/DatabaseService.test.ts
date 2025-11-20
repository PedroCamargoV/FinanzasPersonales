/**
 * DatabaseService Unit Tests
 *
 * Test suite for DatabaseService structure, types, and error handling
 */

import { describe, it, expect } from 'vitest'
import { DatabaseService } from '../DatabaseService'
import { DatabaseError, ErrorCode } from '@/types'

describe('DatabaseService', () => {
  describe('Initialization Status', () => {
    it('should have uninitialized status on startup', () => {
      // Reset state
      DatabaseService.close()

      const status = DatabaseService.getStatus()
      expect(status).toBe('uninitialized')
    })

    it('should return null connection when not initialized', () => {
      DatabaseService.close()

      const connection = DatabaseService.getConnection()
      expect(connection).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('should throw DatabaseError when database not initialized', async () => {
      DatabaseService.close()

      await expect(DatabaseService.getById('transactions', '123')).rejects.toThrow(DatabaseError)
    })

    it('should throw DatabaseError with correct structure', async () => {
      DatabaseService.close()

      try {
        await DatabaseService.getById('transactions', '123')
      } catch (error) {
        expect(error).toBeInstanceOf(DatabaseError)
        const dbError = error as DatabaseError
        expect(dbError.code).toBe(ErrorCode.DB_NOT_INITIALIZED)
        expect(dbError.operation).toBe('read')
        expect(dbError.storeName).toBe('transactions')
        expect(dbError.timestamp).toBeDefined()
      }
    })

    it('DatabaseError should extend Error', () => {
      const error = new DatabaseError({
        code: ErrorCode.DB_NOT_FOUND,
        message: 'Record not found',
        operation: 'read',
        storeName: 'transactions',
      })

      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('DatabaseError')
      expect(error.message).toBe('Record not found')
      expect(error.code).toBe(ErrorCode.DB_NOT_FOUND)
    })

    it('should include context in error when provided', () => {
      const context = { attempted_id: '123', store_name: 'transactions' }
      const error = new DatabaseError({
        code: ErrorCode.DB_NOT_FOUND,
        message: 'Not found',
        operation: 'read',
        storeName: 'transactions',
        context,
      })

      expect(error.context).toEqual(context)
    })

    it('should include duration in error when provided', () => {
      const error = new DatabaseError({
        code: ErrorCode.OPERATION_TIMEOUT,
        message: 'Operation timed out',
        operation: 'query',
        storeName: 'transactions',
        duration: 5000,
      })

      expect(error.duration).toBe(5000)
    })
  })

  describe('Close and Reset', () => {
    it('should close database connection', () => {
      DatabaseService.close()

      const status = DatabaseService.getStatus()
      expect(status).toBe('uninitialized')
    })

    it('should allow multiple close calls', () => {
      DatabaseService.close()
      DatabaseService.close()
      DatabaseService.close()

      const status = DatabaseService.getStatus()
      expect(status).toBe('uninitialized')
    })
  })

  describe('Type Safety', () => {
    it('should have properly typed static methods', () => {
      const methods = ['initialize', 'getById', 'getAll', 'create', 'update', 'delete', 'query', 'clear']

      for (const method of methods) {
        expect(typeof (DatabaseService as any)[method]).toBe('function')
      }
    })

    it('should have connection getter methods', () => {
      expect(typeof DatabaseService.getStatus).toBe('function')
      expect(typeof DatabaseService.getConnection).toBe('function')
    })
  })

  describe('Error Codes', () => {
    it('should support all error codes', () => {
      const validCodes = [
        ErrorCode.DB_NOT_INITIALIZED,
        ErrorCode.DB_CONNECTION_FAILED,
        ErrorCode.DB_NOT_FOUND,
        ErrorCode.DB_DUPLICATE,
        ErrorCode.DB_QUERY_FAILED,
        ErrorCode.DB_TRANSACTION_FAILED,
      ]

      for (const code of validCodes) {
        const error = new DatabaseError({
          code,
          message: 'Test error',
          operation: 'read',
          storeName: 'transactions',
        })

        expect(error.code).toBe(code)
      }
    })
  })

  describe('Performance Metadata', () => {
    it('should include operation duration information', () => {
      const error = new DatabaseError({
        code: ErrorCode.OPERATION_TIMEOUT,
        message: 'Query too slow',
        operation: 'query',
        storeName: 'transactions',
        duration: 250,
      })

      expect(error.duration).toBe(250)
      expect(error.operation).toBe('query')
    })

    it('should allow tracking multiple operation types', () => {
      const operations: Array<'create' | 'read' | 'update' | 'delete' | 'query' | 'transaction'> = [
        'create',
        'read',
        'update',
        'delete',
        'query',
        'transaction',
      ]

      for (const op of operations) {
        const error = new DatabaseError({
          code: ErrorCode.DB_TRANSACTION_FAILED,
          message: 'Operation failed',
          operation: op,
          storeName: 'transactions',
        })

        expect(error.operation).toBe(op)
      }
    })
  })

  describe('Method Existence', () => {
    it('should have all CRUD methods implemented', () => {
      expect(DatabaseService.initialize).toBeDefined()
      expect(DatabaseService.create).toBeDefined()
      expect(DatabaseService.getById).toBeDefined()
      expect(DatabaseService.getAll).toBeDefined()
      expect(DatabaseService.query).toBeDefined()
      expect(DatabaseService.update).toBeDefined()
      expect(DatabaseService.delete).toBeDefined()
      expect(DatabaseService.clear).toBeDefined()
    })

    it('should have utility methods', () => {
      expect(DatabaseService.getStatus).toBeDefined()
      expect(DatabaseService.getConnection).toBeDefined()
      expect(DatabaseService.close).toBeDefined()
    })
  })
})
