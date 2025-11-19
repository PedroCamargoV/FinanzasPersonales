/**
 * UUID generation utilities
 */

import { v4 as uuidv4 } from 'uuid'

/**
 * Generate a new UUID v4 identifier
 *
 * @example
 * const id = generateId() // "123e4567-e89b-12d3-a456-426614174000"
 *
 * @returns UUID v4 string
 */
export const generateId = (): string => uuidv4()

/**
 * Generate multiple UUIDs
 *
 * @example
 * const ids = generateIds(5) // ["uuid1", "uuid2", "uuid3", "uuid4", "uuid5"]
 *
 * @param count - Number of IDs to generate
 * @returns Array of UUID v4 strings
 */
export const generateIds = (count: number): string[] => {
  return Array.from({ length: count }, () => generateId())
}

/**
 * Validate if a string is a valid UUID v4
 *
 * @example
 * isValidId("123e4567-e89b-12d3-a456-426614174000") // true
 * isValidId("invalid") // false
 *
 * @param id - String to validate
 * @returns True if valid UUID v4 format
 */
export const isValidId = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}
