/**
 * Unified TypeScript types export
 * All type definitions are exported from this index for convenience
 */

// Transaction types
export type { Transaction, CreateTransactionDTO, UpdateTransactionDTO, TransactionQueryResult } from './transaction'
export type { TransactionType } from './transaction'

// Category types
export type { Category, TransactionQuery } from './category'
export { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from './category'

// Database types
export type {
  DBConfig,
  DBStoreConfig,
  DBIndexConfig,
  DBTransactionMode,
  DBOperationResult,
  DBBatchOperationResult,
  DBInitOptions,
  DBQueryFilter,
  DBConnection,
} from './database'
export { DBStoreName } from './database'
export type { DBInitStatus } from './database'

// Error types
export type {
  AppError,
  ValidationError,
  ValidationErrorResult,
  CategoryError,
  TransactionError,
} from './error'
export { ErrorCode, ErrorSeverity, DatabaseError } from './error'
export {
  isValidationError,
  isDatabaseError,
  isCategoryError,
  isTransactionError,
} from './error'
