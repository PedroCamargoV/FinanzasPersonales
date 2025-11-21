/**
 * Currency utilities for Latin American formatting
 * 
 * Handles conversion between:
 * - Latin American format: "1.500,50" (thousands separator = ".", decimal separator = ",")
 * - Standard numeric format: 1500.50
 */

/**
 * Parse Latin American currency format to number
 * 
 * Converts formats like:
 * - "1500" → 1500
 * - "1500,50" → 1500.50
 * - "1.500" → 1500
 * - "1.500,50" → 1500.50
 * 
 * @param value - String value in Latin American format
 * @returns Number or 0 if invalid
 * 
 * @example
 * parseLatinoAmount("1.500,50") // returns 1500.50
 * parseLatinoAmount("1500,50")  // returns 1500.50
 * parseLatinoAmount("1.500")    // returns 1500
 */
export function parseLatinoAmount(value: string | number): number {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value
  }

  if (!value || typeof value !== 'string') {
    return 0
  }

  // Trim whitespace
  let cleaned = value.trim()

  // If empty, return 0
  if (cleaned === '') {
    return 0
  }

  // Replace thousands separator (.) with empty string
  // Then replace decimal separator (,) with (.)
  // Example: "1.500,50" → "1500,50" → "1500.50"
  cleaned = cleaned.replace(/\./g, '') // Remove thousands separators
  cleaned = cleaned.replace(/,/g, '.') // Convert comma to period for decimal

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100 // Round to 2 decimals
}

/**
 * Format number to Latin American currency format
 * 
 * Converts numbers to format:
 * - 1500 → "1.500"
 * - 1500.50 → "1.500,50"
 * - 1500.5 → "1.500,50"
 * 
 * @param value - Number to format
 * @param showCents - Whether to always show cents (default: true)
 * @returns Formatted string in Latin American format
 * 
 * @example
 * formatLatinoAmount(1500.50)      // returns "1.500,50"
 * formatLatinoAmount(1500)         // returns "1.500,00"
 * formatLatinoAmount(1500, false)  // returns "1.500"
 */
export function formatLatinoAmount(value: number | string, showCents = true): string {
  // Parse to ensure it's a number
  const num = typeof value === 'string' ? parseLatinoAmount(value) : value

  if (isNaN(num)) {
    return '0'
  }

  // Split integer and decimal parts
  const parts = num.toFixed(2).split('.')
  const integer = parts[0]
  const decimal = parts[1] || '00'

  // Add thousands separators to integer part
  const integerFormatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  // Return formatted string
  if (showCents) {
    return `${integerFormatted},${decimal}`
  }

  // If decimal is .00 and showCents is false, don't show it
  if (decimal === '00') {
    return integerFormatted
  }

  return `${integerFormatted},${decimal}`
}

/**
 * Display currency with styling (for UI display)
 * 
 * Formats amount with proper spacing and sign indication
 * 
 * @param value - Number to format
 * @param type - Transaction type ('ingreso' or 'gasto')
 * @param showSymbol - Whether to show + or - symbol (default: true)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrencyDisplay(1500.50, 'ingreso')  // returns "+$1.500,50"
 * formatCurrencyDisplay(1500.50, 'gasto')    // returns "-$1.500,50"
 */
export function formatCurrencyDisplay(
  value: number | string,
  type?: 'ingreso' | 'gasto' | 'balance',
  showSymbol = true
): string {
  const num = typeof value === 'string' ? parseLatinoAmount(value) : value
  
  if (isNaN(num)) {
    return '$0,00'
  }

  const formatted = formatLatinoAmount(num, true)
  
  if (!showSymbol || type === 'balance') {
    return `$${formatted}`
  }

  const symbol = type === 'ingreso' ? '+' : '-'
  return `${symbol}$${formatted}`
}

/**
 * Validate if a string is valid Latin American currency format
 * 
 * @param value - String to validate
 * @returns True if valid format
 * 
 * @example
 * isValidLatinoFormat("1.500,50") // true
 * isValidLatinoFormat("1500,50")  // true
 * isValidLatinoFormat("abc")      // false
 */
export function isValidLatinoFormat(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  // Allow digits, dots (thousands), commas (decimal), and spaces
  const pattern = /^[\d\s.,]*$/
  if (!pattern.test(value)) {
    return false
  }

  // Try to parse it
  const parsed = parseLatinoAmount(value)
  return !isNaN(parsed) && isFinite(parsed)
}

/**
 * Get the decimal places in a value
 * 
 * @param value - Number or formatted string
 * @returns Number of decimal places
 * 
 * @example
 * getDecimalPlaces(1500.50)      // returns 2
 * getDecimalPlaces("1.500,50")   // returns 2
 * getDecimalPlaces("1500")       // returns 0
 */
export function getDecimalPlaces(value: number | string): number {
  if (typeof value === 'string') {
    const parsed = value.split(',')
    return parsed.length > 1 ? parsed[1].length : 0
  }

  const str = value.toString()
  const parts = str.split('.')
  return parts.length > 1 ? parts[1].length : 0
}
