/**
 * Performance monitoring and measurement utilities
 */

import { PERFORMANCE_TARGETS } from './constants'

/**
 * Performance measurement result
 */
export interface PerformanceMeasurement {
  /** Operation name */
  name: string

  /** Duration in milliseconds */
  duration: number

  /** Target duration in milliseconds (if applicable) */
  target?: number

  /** Whether operation met performance target */
  metTarget: boolean

  /** Timestamp when measurement was recorded */
  timestamp: string
}

/**
 * Performance metrics tracker
 */
class PerformanceTracker {
  private measurements: Map<string, number[]> = new Map()
  private currentMarks: Map<string, number> = new Map()

  /**
   * Start measuring an operation
   *
   * @example
   * perf.start('db-query')
   * // ... do work ...
   * const result = perf.end('db-query', 100)
   *
   * @param operationName - Unique name for the operation
   */
  start(operationName: string): void {
    this.currentMarks.set(operationName, performance.now())
  }

  /**
   * End measuring an operation and record result
   *
   * @param operationName - Unique name for the operation
   * @param target - Target duration in milliseconds (optional)
   * @returns Performance measurement result, or undefined if start() was not called
   */
  end(operationName: string, target?: number): PerformanceMeasurement | undefined {
    const startTime = this.currentMarks.get(operationName)
    if (startTime === undefined) {
      // Silently return undefined instead of throwing error
      // This allows graceful handling in error paths
      return undefined
    }

    const duration = performance.now() - startTime
    this.currentMarks.delete(operationName)

    // Record measurement
    const measurements = this.measurements.get(operationName) || []
    measurements.push(duration)
    this.measurements.set(operationName, measurements)

    const metTarget = target === undefined || duration <= target

    return {
      name: operationName,
      duration: Math.round(duration * 100) / 100,
      target,
      metTarget,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Get average duration for an operation
   *
   * @param operationName - Operation name
   * @returns Average duration in milliseconds, or undefined if no measurements
   */
  getAverage(operationName: string): number | undefined {
    const measurements = this.measurements.get(operationName)
    if (!measurements || measurements.length === 0) return undefined

    const sum = measurements.reduce((a, b) => a + b, 0)
    return Math.round((sum / measurements.length) * 100) / 100
  }

  /**
   * Get statistics for an operation
   *
   * @param operationName - Operation name
   * @returns Statistics including min, max, average, count
   */
  getStats(operationName: string): {
    count: number
    min: number
    max: number
    average: number
  } | null {
    const measurements = this.measurements.get(operationName)
    if (!measurements || measurements.length === 0) return null

    return {
      count: measurements.length,
      min: Math.min(...measurements),
      max: Math.max(...measurements),
      average:
        Math.round((measurements.reduce((a, b) => a + b, 0) / measurements.length) * 100) / 100,
    }
  }

  /**
   * Clear all measurements
   */
  clear(): void {
    this.measurements.clear()
    this.currentMarks.clear()
  }

  /**
   * Get all measurements as summary
   */
  getSummary(): Record<string, { count: number; average: number }> {
    const summary: Record<string, { count: number; average: number }> = {}

    for (const [name, measurements] of this.measurements.entries()) {
      const average =
        measurements.reduce((a, b) => a + b, 0) / measurements.length
      summary[name] = {
        count: measurements.length,
        average: Math.round(average * 100) / 100,
      }
    }

    return summary
  }
}

/**
 * Global performance tracker instance
 */
export const performanceTracker = new PerformanceTracker()

/**
 * Measure async function execution
 *
 * @example
 * const result = await measureAsync('api-call', async () => {
 *   return await fetchData()
 * }, 500)
 *
 * @param name - Operation name
 * @param fn - Async function to measure
 * @param target - Target duration in milliseconds (optional)
 * @returns Function result
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  target?: number
): Promise<T> {
  performanceTracker.start(name)
  try {
    const result = await fn()
    performanceTracker.end(name, target)
    return result
  } catch (error) {
    performanceTracker.end(name, target)
    throw error
  }
}

/**
 * Measure sync function execution
 *
 * @example
 * const result = measureSync('calculation', () => {
 *   return calculateTotal(items)
 * }, 10)
 *
 * @param name - Operation name
 * @param fn - Sync function to measure
 * @param target - Target duration in milliseconds (optional)
 * @returns Function result
 */
export function measureSync<T>(
  name: string,
  fn: () => T,
  target?: number
): T {
  performanceTracker.start(name)
  try {
    const result = fn()
    performanceTracker.end(name, target)
    return result
  } catch (error) {
    performanceTracker.end(name, target)
    throw error
  }
}

/**
 * Check if operation meets performance target
 *
 * @example
 * const duration = 45
 * meetsTarget('db-read', duration) // true if target is 50
 *
 * @param operationType - Type of operation (from PERFORMANCE_TARGETS)
 * @param duration - Actual duration in milliseconds
 * @returns True if meets target
 */
export function meetsTarget(
  operationType: keyof typeof PERFORMANCE_TARGETS,
  duration: number
): boolean {
  const target = PERFORMANCE_TARGETS[operationType]
  return duration <= target
}

/**
 * Log performance summary to console
 *
 * @param label - Optional label for the summary
 */
export function logPerformanceSummary(label?: string): void {
  const summary = performanceTracker.getSummary()

  console.group(`Performance Summary${label ? `: ${label}` : ''}`)
  for (const [name, stats] of Object.entries(summary)) {
    console.log(
      `${name}: ${stats.count} calls, avg ${stats.average}ms`
    )
  }
  console.groupEnd()
}
