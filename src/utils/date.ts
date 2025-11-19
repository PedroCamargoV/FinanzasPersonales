/**
 * Date formatting and validation utilities
 */

import { format, parseISO, isValid, startOfDay, endOfDay } from 'date-fns'

/**
 * Format an ISO date string to a readable format
 *
 * @example
 * formatDate("2024-01-15T10:30:00Z") // "2024-01-15"
 *
 * @param dateString - ISO 8601 date string
 * @param formatPattern - date-fns format pattern (default: 'yyyy-MM-dd')
 * @returns Formatted date string
 * @throws Error if date string is invalid
 */
export const formatDate = (
  dateString: string,
  formatPattern: string = 'yyyy-MM-dd'
): string => {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) {
      throw new Error(`Invalid date: ${dateString}`)
    }
    return format(date, formatPattern)
  } catch (error) {
    throw new Error(
      `Failed to format date "${dateString}": ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Validate if a string is a valid ISO 8601 date
 *
 * @example
 * isValidDate("2024-01-15") // true
 * isValidDate("2024-13-45") // false
 * isValidDate("invalid") // false
 *
 * @param dateString - String to validate
 * @returns True if valid ISO 8601 date
 */
export const isValidDate = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString)
    return isValid(date)
  } catch {
    return false
  }
}

/**
 * Parse ISO date string to JavaScript Date object
 *
 * @example
 * const date = parseDate("2024-01-15") // Date object
 *
 * @param dateString - ISO 8601 date string
 * @returns Date object
 * @throws Error if date string is invalid
 */
export const parseDate = (dateString: string): Date => {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) {
      throw new Error(`Invalid date: ${dateString}`)
    }
    return date
  } catch (error) {
    throw new Error(
      `Failed to parse date "${dateString}": ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Get the start of day (00:00:00) for a given date
 *
 * @example
 * getStartOfDay("2024-01-15T14:30:00Z") // "2024-01-15T00:00:00.000Z"
 *
 * @param dateString - ISO 8601 date string
 * @returns ISO 8601 string at start of day
 */
export const getStartOfDay = (dateString: string): string => {
  const date = parseDate(dateString)
  return startOfDay(date).toISOString()
}

/**
 * Get the end of day (23:59:59) for a given date
 *
 * @example
 * getEndOfDay("2024-01-15T14:30:00Z") // "2024-01-15T23:59:59.999Z"
 *
 * @param dateString - ISO 8601 date string
 * @returns ISO 8601 string at end of day
 */
export const getEndOfDay = (dateString: string): string => {
  const date = parseDate(dateString)
  return endOfDay(date).toISOString()
}

/**
 * Get current timestamp in ISO 8601 format
 *
 * @example
 * getCurrentTimestamp() // "2024-01-15T10:30:45.123Z"
 *
 * @returns Current ISO 8601 timestamp
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString()
}

/**
 * Check if a date is in the past
 *
 * @example
 * isPastDate("2020-01-15") // true
 * isPastDate("2099-01-15") // false
 *
 * @param dateString - ISO 8601 date string
 * @returns True if date is in the past
 */
export const isPastDate = (dateString: string): boolean => {
  const date = parseDate(dateString)
  return date < new Date()
}

/**
 * Check if a date is today
 *
 * @example
 * isTodayDate("2024-01-15") // depends on current date
 *
 * @param dateString - ISO 8601 date string
 * @returns True if date is today
 */
export const isTodayDate = (dateString: string): boolean => {
  const date = parseDate(dateString)
  const today = startOfDay(new Date())
  return date.getTime() === today.getTime()
}

/**
 * Validate date range (start <= end)
 *
 * @example
 * isValidDateRange("2024-01-01", "2024-12-31") // true
 * isValidDateRange("2024-12-31", "2024-01-01") // false
 *
 * @param startDateString - ISO 8601 start date
 * @param endDateString - ISO 8601 end date
 * @returns True if range is valid
 */
export const isValidDateRange = (
  startDateString: string,
  endDateString: string
): boolean => {
  try {
    const startDate = parseDate(startDateString)
    const endDate = parseDate(endDateString)
    return startDate <= endDate
  } catch {
    return false
  }
}
