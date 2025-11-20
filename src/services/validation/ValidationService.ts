import { Transaction, Category } from '@/types'
import { VALIDATION, ERROR_MESSAGES } from '@/utils/constants'
import { isValidDate, isPastDate } from '@/utils/date'

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean

  /** List of validation error messages */
  errors: string[]

  /** List of validation warning messages */
  warnings: string[]
}

/**
 * ValidationService - Validates transactions and categories
 * 
 * Provides methods for:
 * - Validating transaction data
 * - Validating category data
 * - Validating amounts, dates, titles
 * - Detailed error messaging
 */
class ValidationService {
  private static instance: ValidationService

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ValidationService {
    if (!this.instance) {
      this.instance = new ValidationService()
    }
    return this.instance
  }

  /**
   * Validate transaction data
   * 
   * @param transaction - Transaction to validate
   * @returns ValidationResult with isValid status and error messages
   * 
   * @example
   * const result = ValidationService.validateTransaction(transactionData)
   * if (!result.isValid) {
   *   console.error(result.errors)
   * }
   */
  validateTransaction(transaction: Partial<Transaction>): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate title
    if (!transaction.title) {
      errors.push(ERROR_MESSAGES.VALIDATION_INVALID_TRANSACTION_TITLE)
    } else if (transaction.title.length < VALIDATION.TRANSACTION_TITLE_MIN_LENGTH || 
               transaction.title.length > VALIDATION.TRANSACTION_TITLE_MAX_LENGTH) {
      errors.push(ERROR_MESSAGES.VALIDATION_INVALID_TRANSACTION_TITLE)
    }

    // Validate amount
    if (transaction.amount === undefined || transaction.amount === null) {
      errors.push(ERROR_MESSAGES.VALIDATION_INVALID_TRANSACTION_AMOUNT)
    } else if (typeof transaction.amount !== 'number' ||
               transaction.amount < VALIDATION.TRANSACTION_AMOUNT_MIN ||
               transaction.amount > VALIDATION.TRANSACTION_AMOUNT_MAX) {
      errors.push(ERROR_MESSAGES.VALIDATION_INVALID_TRANSACTION_AMOUNT)
    }

    // Validate date
    if (!transaction.date) {
      errors.push(ERROR_MESSAGES.VALIDATION_INVALID_DATE)
    } else if (!isValidDate(transaction.date)) {
      errors.push(ERROR_MESSAGES.VALIDATION_INVALID_DATE)
    } else if (isPastDate(transaction.date)) {
      warnings.push('Date is in the past')
    }

    // Validate type
    if (!transaction.type) {
      errors.push(ERROR_MESSAGES.VALIDATION_INVALID_TYPE)
    } else if (transaction.type !== 'ingreso' && transaction.type !== 'gasto') {
      errors.push(ERROR_MESSAGES.VALIDATION_INVALID_TYPE)
    }

    // Validate category
    if (!transaction.category) {
      errors.push(ERROR_MESSAGES.VALIDATION_INVALID_CATEGORY)
    } else if (typeof transaction.category !== 'string') {
      errors.push(ERROR_MESSAGES.VALIDATION_INVALID_CATEGORY)
    }

    // Validate description (optional)
    if (transaction.description && transaction.description.length > VALIDATION.TRANSACTION_DESCRIPTION_MAX_LENGTH) {
      errors.push(`Description must not exceed ${VALIDATION.TRANSACTION_DESCRIPTION_MAX_LENGTH} characters`)
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate transaction update data
   * 
   * Stricter validation - all provided fields must be valid
   * 
   * @param updates - Partial transaction updates
   * @returns ValidationResult
   * 
   * @example
   * const result = ValidationService.validateTransactionUpdate(updates)
   */
  validateTransactionUpdate(updates: Partial<Transaction>): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Only validate fields that are being updated
    if (updates.title !== undefined) {
      if (updates.title.length < VALIDATION.TRANSACTION_TITLE_MIN_LENGTH ||
          updates.title.length > VALIDATION.TRANSACTION_TITLE_MAX_LENGTH) {
        errors.push(ERROR_MESSAGES.VALIDATION_INVALID_TRANSACTION_TITLE)
      }
    }

    if (updates.amount !== undefined) {
      if (typeof updates.amount !== 'number' ||
          updates.amount < VALIDATION.TRANSACTION_AMOUNT_MIN ||
          updates.amount > VALIDATION.TRANSACTION_AMOUNT_MAX) {
        errors.push(ERROR_MESSAGES.VALIDATION_INVALID_TRANSACTION_AMOUNT)
      }
    }

    if (updates.date !== undefined) {
      if (!isValidDate(updates.date)) {
        errors.push(ERROR_MESSAGES.VALIDATION_INVALID_DATE)
      } else if (isPastDate(updates.date)) {
        warnings.push('Date is in the past')
      }
    }

    if (updates.type !== undefined) {
      if (updates.type !== 'ingreso' && updates.type !== 'gasto') {
        errors.push(ERROR_MESSAGES.VALIDATION_INVALID_TYPE)
      }
    }

    if (updates.category !== undefined) {
      if (!updates.category || typeof updates.category !== 'string') {
        errors.push(ERROR_MESSAGES.VALIDATION_INVALID_CATEGORY)
      }
    }

    if (updates.description !== undefined && updates.description) {
      if (updates.description.length > VALIDATION.TRANSACTION_DESCRIPTION_MAX_LENGTH) {
        errors.push(`Description must not exceed ${VALIDATION.TRANSACTION_DESCRIPTION_MAX_LENGTH} characters`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate category data
   * 
   * @param category - Category to validate
   * @returns ValidationResult
   * 
   * @example
   * const result = ValidationService.validateCategory(categoryData)
   */
  validateCategory(category: Partial<Category>): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate name
    if (!category.name) {
      errors.push('Category name is required')
    } else if (category.name.length < VALIDATION.CATEGORY_NAME_MIN_LENGTH ||
               category.name.length > VALIDATION.CATEGORY_NAME_MAX_LENGTH) {
      errors.push(`Category name must be between ${VALIDATION.CATEGORY_NAME_MIN_LENGTH} and ${VALIDATION.CATEGORY_NAME_MAX_LENGTH} characters`)
    }

    // Validate type
    if (!category.type) {
      errors.push('Category type is required')
    } else if (category.type !== 'ingreso' && category.type !== 'gasto') {
      errors.push('Category type must be either "ingreso" or "gasto"')
    }

    // Validate color (optional, but if provided must be valid hex)
    if (category.color) {
      if (!VALIDATION.CATEGORY_COLOR_PATTERN.test(category.color)) {
        errors.push('Category color must be a valid hex color (e.g., #FF0000)')
      }
    }

    // Warn if system-defined is being set
    if (category.isSystemDefined === true) {
      warnings.push('Creating system-defined category - this is not recommended')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate amount value
   * 
   * @param amount - Amount to validate
   * @returns boolean - True if valid amount
   */
  validateAmount(amount: unknown): boolean {
    if (typeof amount !== 'number') {
      return false
    }
    return amount >= VALIDATION.TRANSACTION_AMOUNT_MIN &&
           amount <= VALIDATION.TRANSACTION_AMOUNT_MAX &&
           !isNaN(amount) &&
           isFinite(amount)
  }

  /**
   * Validate date value
   * 
   * @param date - Date string to validate (YYYY-MM-DD format)
   * @returns boolean - True if valid date
   */
  validateDateValue(date: unknown): boolean {
    if (typeof date !== 'string') {
      return false
    }
    return isValidDate(date)
  }

  /**
   * Validate title/name
   * 
   * @param title - Title to validate
   * @param minLength - Minimum length (optional)
   * @param maxLength - Maximum length (optional)
   * @returns boolean - True if valid title
   */
  validateTitle(title: unknown, minLength = VALIDATION.TRANSACTION_TITLE_MIN_LENGTH, 
                maxLength = VALIDATION.TRANSACTION_TITLE_MAX_LENGTH): boolean {
    if (typeof title !== 'string') {
      return false
    }
    return title.length >= minLength && title.length <= maxLength
  }

  /**
   * Validate transaction type
   * 
   * @param type - Type to validate
   * @returns boolean - True if valid type
   */
  validateType(type: unknown): boolean {
    return type === 'ingreso' || type === 'gasto'
  }

  /**
   * Validate category ID
   * 
   * @param categoryId - Category ID to validate
   * @returns boolean - True if valid category ID
   */
  validateCategoryId(categoryId: unknown): boolean {
    if (typeof categoryId !== 'string') {
      return false
    }
    return categoryId.length > 0
  }

  /**
   * Get error message by error code
   * 
   * @param errorCode - Error code
   * @returns Error message
   */
  getErrorMessage(errorCode: string): string {
    const messages: Record<string, string> = {
      ...ERROR_MESSAGES
    }
    return messages[errorCode] || ERROR_MESSAGES.UNKNOWN_ERROR
  }

  /**
   * Check if validation result has errors
   * 
   * @param result - Validation result
   * @returns boolean - True if there are errors
   */
  hasErrors(result: ValidationResult): boolean {
    return result.errors.length > 0
  }

  /**
   * Check if validation result has warnings
   * 
   * @param result - Validation result
   * @returns boolean - True if there are warnings
   */
  hasWarnings(result: ValidationResult): boolean {
    return result.warnings.length > 0
  }

  /**
   * Get all validation messages (errors + warnings)
   * 
   * @param result - Validation result
   * @returns Array of all messages
   */
  getAllMessages(result: ValidationResult): string[] {
    return [...result.errors, ...result.warnings]
  }
}

// Export singleton instance
export default ValidationService.getInstance()
