/**
 * Unified utilities export
 * All utility functions are exported from this index for convenience
 */

// UUID utilities
export { generateId, generateIds, isValidId } from './uuid'

// Date utilities
export {
  formatDate,
  isValidDate,
  parseDate,
  getStartOfDay,
  getEndOfDay,
  getCurrentTimestamp,
  isPastDate,
  isTodayDate,
  isValidDateRange,
} from './date'

// Constants
export {
  VALIDATION,
  DATABASE,
  ERROR_MESSAGES,
  PERFORMANCE_TARGETS,
  CACHE_DURATION,
  FEATURE_FLAGS,
  UI,
} from './constants'

// Performance utilities
export {
  performanceTracker,
  measureAsync,
  measureSync,
  meetsTarget,
  logPerformanceSummary,
} from './performance'
export type { PerformanceMeasurement } from './performance'

// Currency utilities (Latin American format)
export {
  parseLatinoAmount,
  formatLatinoAmount,
  displayCurrency,
  isValidLatinoFormat,
  getDecimalPlaces,
} from './currency'

