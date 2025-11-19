/**
 * Transaction type union
 * Represents the two possible transaction types
 */
export type TransactionType = 'ingreso' | 'gasto'

/**
 * Represents a single financial transaction (income or expense)
 *
 * @example
 * const transaction: Transaction = {
 *   id: "550e8400-e29b-41d4-a716-446655440000",
 *   title: "Grocery shopping",
 *   amount: 45.50,
 *   date: "2024-01-15",
 *   category: "Groceries",
 *   type: "gasto",
 *   description: "Weekly groceries",
 *   tags: ["food", "weekly"],
 *   createdAt: "2024-01-15T10:30:00Z",
 *   updatedAt: "2024-01-15T10:30:00Z"
 * }
 */
export interface Transaction {
  /** Unique identifier (UUID v4) */
  id: string

  /** Transaction title/description (1-255 characters) */
  title: string

  /** Monetary amount (positive, max 2 decimal places, range: 0.01 to 9,999,999.99) */
  amount: number

  /** Transaction date (ISO 8601: YYYY-MM-DD), must not be a future date */
  date: string

  /** Category name (must reference existing category) */
  category: string

  /** Transaction type */
  type: TransactionType

  /** Optional description (0-1000 characters) */
  description?: string

  /** Optional tags for custom organization */
  tags?: string[]

  /** Auto-generated timestamp (ISO 8601) */
  createdAt: string

  /** Auto-updated timestamp (ISO 8601) */
  updatedAt: string
}

/** Convenience type for income transactions */
export type IncomeTransaction = Transaction & { type: 'ingreso' }

/** Convenience type for expense transactions */
export type ExpenseTransaction = Transaction & { type: 'gasto' }

/**
 * Data Transfer Object for creating transactions
 */
export interface CreateTransactionDTO {
  title: string
  amount: number
  date: string
  category: string
  type: TransactionType
  description?: string
  tags?: string[]
}

/**
 * Data Transfer Object for updating transactions
 */
export interface UpdateTransactionDTO {
  title?: string
  amount?: number
  date?: string
  category?: string
  type?: TransactionType
  description?: string
  tags?: string[]
}

/**
 * Result of a transaction query operation
 */
export interface TransactionQueryResult {
  transactions: Transaction[]
  total: number
  offset: number
  limit?: number
}
