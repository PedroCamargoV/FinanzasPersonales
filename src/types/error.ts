/**
 * Application error base interface
 *
 * @example
 * const error: AppError = {
 *   code: "VALIDATION_ERROR",
 *   message: "Invalid transaction amount",
 *   timestamp: "2024-01-01T00:00:00Z",
 *   context: { amount: -100 }
 * }
 */
export interface AppError {
  /** Error code (unique identifier) */
  code: string

  /** Human-readable error message */
  message: string

  /** When error occurred (ISO 8601) */
  timestamp: string

  /** Error context (additional information) */
  context?: Record<string, unknown>

  /** Original error if wrapped */
  cause?: Error
}

/**
 * Validation error for data validation failures
 *
 * @example
 * const error: ValidationError = {
 *   code: "VALIDATION_ERROR",
 *   message: "Amount must be positive",
 *   timestamp: "2024-01-01T00:00:00Z",
 *   field: "amount",
 *   value: -100,
 *   constraint: "positive-number"
 * }
 */
export interface ValidationError extends AppError {
  /** Field that failed validation */
  field: string

  /** Value that failed validation */
  value: unknown

  /** Validation constraint that failed */
  constraint: string
}

/**
 * Multiple validation errors result
 */
export interface ValidationErrorResult {
  /** All validation errors */
  errors: ValidationError[]

  /** Count of errors */
  count: number

  /** First error summary for logging */
  summary: string
}

/**
 * Database error for data persistence issues
 *
 * @example
 * const error: DatabaseError = {
 *   code: "DB_NOT_FOUND",
 *   message: "Transaction not found",
 *   timestamp: "2024-01-01T00:00:00Z",
 *   operation: "getTransaction",
 *   storeName: "transactions"
 * }
 */
export interface DatabaseError extends AppError {
  /** Database operation type */
  operation: 'create' | 'read' | 'update' | 'delete' | 'query' | 'transaction'

  /** Object store name */
  storeName: string

  /** Query key if applicable */
  key?: unknown

  /** Duration of failed operation in milliseconds */
  duration?: number
}

/**
 * Category-related error
 *
 * @example
 * const error: CategoryError = {
 *   code: "CATEGORY_NOT_FOUND",
 *   message: "Category 'salary' not found",
 *   timestamp: "2024-01-01T00:00:00Z",
 *   categoryId: "salary"
 * }
 */
export interface CategoryError extends AppError {
  /** Category identifier */
  categoryId: string

  /** Category type (if applicable) */
  type?: 'ingreso' | 'gasto'
}

/**
 * Transaction-related error
 *
 * @example
 * const error: TransactionError = {
 *   code: "TRANSACTION_NOT_FOUND",
 *   message: "Transaction not found",
 *   timestamp: "2024-01-01T00:00:00Z",
 *   transactionId: "txn-123"
 * }
 */
export interface TransactionError extends AppError {
  /** Transaction identifier */
  transactionId: string

  /** Related category (if applicable) */
  category?: string

  /** Operation type */
  operation?: 'create' | 'update' | 'delete'
}

/**
 * Error codes for type-safe error handling
 */
export enum ErrorCode {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_TRANSACTION = 'INVALID_TRANSACTION',
  INVALID_CATEGORY = 'INVALID_CATEGORY',
  INVALID_DATE = 'INVALID_DATE',
  INVALID_AMOUNT = 'INVALID_AMOUNT',

  // Database errors
  DB_NOT_INITIALIZED = 'DB_NOT_INITIALIZED',
  DB_CONNECTION_FAILED = 'DB_CONNECTION_FAILED',
  DB_NOT_FOUND = 'DB_NOT_FOUND',
  DB_DUPLICATE = 'DB_DUPLICATE',
  DB_QUERY_FAILED = 'DB_QUERY_FAILED',
  DB_TRANSACTION_FAILED = 'DB_TRANSACTION_FAILED',

  // Category errors
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  CATEGORY_SYSTEM_PROTECTED = 'CATEGORY_SYSTEM_PROTECTED',
  CATEGORY_INVALID_TYPE = 'CATEGORY_INVALID_TYPE',

  // Transaction errors
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  TRANSACTION_INVALID_CATEGORY = 'TRANSACTION_INVALID_CATEGORY',
  TRANSACTION_DUPLICATE = 'TRANSACTION_DUPLICATE',

  // General errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  OPERATION_TIMEOUT = 'OPERATION_TIMEOUT',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Type guard to check if error is ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return (
    error instanceof Object &&
    'field' in error &&
    'constraint' in error &&
    'code' in error
  )
}

/**
 * Type guard to check if error is DatabaseError
 */
export function isDatabaseError(error: unknown): error is DatabaseError {
  return (
    error instanceof Object &&
    'operation' in error &&
    'storeName' in error &&
    'code' in error
  )
}

/**
 * Type guard to check if error is CategoryError
 */
export function isCategoryError(error: unknown): error is CategoryError {
  return (
    error instanceof Object &&
    'categoryId' in error &&
    'code' in error &&
    String((error as Record<string, unknown>)['code']).includes('CATEGORY')
  )
}

/**
 * Type guard to check if error is TransactionError
 */
export function isTransactionError(error: unknown): error is TransactionError {
  return (
    error instanceof Object &&
    'transactionId' in error &&
    'code' in error &&
    String((error as Record<string, unknown>)['code']).includes('TRANSACTION')
  )
}
