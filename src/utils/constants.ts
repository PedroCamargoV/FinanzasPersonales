/**
 * Application-wide constants
 */

/**
 * Validation constraints
 */
export const VALIDATION = {
  // Transaction constraints
  TRANSACTION_TITLE_MIN_LENGTH: 1,
  TRANSACTION_TITLE_MAX_LENGTH: 200,
  TRANSACTION_AMOUNT_MIN: 0.01,
  TRANSACTION_AMOUNT_MAX: 999999999.99,
  TRANSACTION_DESCRIPTION_MAX_LENGTH: 1000,
  TRANSACTION_TAGS_MAX_COUNT: 10,
  TRANSACTION_TAG_MAX_LENGTH: 50,

  // Category constraints
  CATEGORY_NAME_MIN_LENGTH: 1,
  CATEGORY_NAME_MAX_LENGTH: 100,
  CATEGORY_COLOR_PATTERN: /^#[0-9A-Fa-f]{6}$/,

  // Date constraints
  DATE_FORMAT: 'yyyy-MM-dd',
  DATETIME_FORMAT: 'yyyy-MM-dd HH:mm:ss',

  // Query constraints
  QUERY_LIMIT_MAX: 1000,
  QUERY_LIMIT_DEFAULT: 100,
  QUERY_OFFSET_MAX: 1000000,
} as const

/**
 * Database configuration
 */
export const DATABASE = {
  NAME: 'finanzas-personales',
  VERSION: 1,
  STORES: {
    TRANSACTIONS: 'transactions',
    CATEGORIES: 'categories',
    BUDGETS: 'budgets',
    SETTINGS: 'settings',
  },
  TIMEOUT_MS: 5000,
  OPERATION_TIMEOUT_MS: 3000,
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  // Validation errors
  VALIDATION_INVALID_TRANSACTION_TITLE: 'Transaction title must be between 1 and 200 characters',
  VALIDATION_INVALID_TRANSACTION_AMOUNT: 'Transaction amount must be between 0.01 and 999,999,999.99',
  VALIDATION_INVALID_DATE: 'Invalid date format. Use ISO 8601 (YYYY-MM-DD)',
  VALIDATION_INVALID_CATEGORY: 'Invalid category ID',
  VALIDATION_INVALID_TYPE: 'Invalid transaction type. Must be "ingreso" or "gasto"',

  // Database errors
  DB_NOT_INITIALIZED: 'Database is not initialized',
  DB_CONNECTION_FAILED: 'Failed to connect to database',
  DB_NOT_FOUND: 'Record not found in database',
  DB_DUPLICATE: 'Record already exists',
  DB_OPERATION_TIMEOUT: 'Database operation timed out',

  // Category errors
  CATEGORY_NOT_FOUND: 'Category not found',
  CATEGORY_SYSTEM_PROTECTED: 'Cannot edit or delete system-defined category',

  // Transaction errors
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  TRANSACTION_INVALID_CATEGORY: 'Invalid transaction category',

  // General errors
  UNKNOWN_ERROR: 'An unknown error occurred',
  OPERATION_TIMEOUT: 'Operation timed out',
} as const

/**
 * Performance targets (in milliseconds)
 */
export const PERFORMANCE_TARGETS = {
  // Database operations
  DB_OPERATION_CREATE: 50,
  DB_OPERATION_READ: 20,
  DB_OPERATION_UPDATE: 50,
  DB_OPERATION_DELETE: 40,
  DB_OPERATION_QUERY: 100,

  // Service operations
  SERVICE_OPERATION_DEFAULT: 100,
  SERVICE_OPERATION_COMPLEX: 500,

  // UI operations
  RENDER_TARGET: 16.67, // 60 FPS
} as const

/**
 * Cache duration (in milliseconds)
 */
export const CACHE_DURATION = {
  CATEGORIES: 24 * 60 * 60 * 1000, // 24 hours
  USER_SETTINGS: 60 * 60 * 1000, // 1 hour
  QUERY_RESULTS: 5 * 60 * 1000, // 5 minutes
} as const

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  ENABLE_BUDGETS: false,
  ENABLE_RECURRING_TRANSACTIONS: false,
  ENABLE_ATTACHMENTS: false,
  ENABLE_SYNC: false,
  ENABLE_ANALYTICS: false,
} as const

/**
 * UI constants
 */
export const UI = {
  // Pagination
  PAGINATION_DEFAULT_PAGE_SIZE: 20,
  PAGINATION_MAX_PAGE_SIZE: 100,

  // Modals
  MODAL_ANIMATION_DURATION_MS: 300,

  // Toast notifications
  TOAST_DURATION_MS: 3000,
  TOAST_DURATION_ERROR_MS: 5000,
} as const
