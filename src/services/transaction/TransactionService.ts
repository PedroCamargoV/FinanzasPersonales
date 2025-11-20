import { DatabaseService } from '@/services/database'
import { ValidationService } from '@/services/validation'
import { Transaction, CreateTransactionDTO, UpdateTransactionDTO } from '@/types'
import { measureAsync } from '@/utils/performance'
import { generateId } from '@/utils/uuid'
import { getCurrentTimestamp } from '@/utils/date'

/**
 * Transaction statistics interface
 */
export interface TransactionStats {
  totalTransactions: number
  totalIncome: number
  totalExpenses: number
  balance: number
  averageTransaction: number
  byType: {
    ingreso: {
      count: number
      total: number
      average: number
    }
    gasto: {
      count: number
      total: number
      average: number
    }
  }
}

/**
 * TransactionService - Manages financial transactions
 * 
 * Provides methods for:
 * - Creating, reading, updating, deleting transactions
 * - Filtering and querying transactions
 * - Calculating statistics and balances
 * - Bulk operations
 */
class TransactionService {
  private static instance: TransactionService

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): TransactionService {
    if (!this.instance) {
      this.instance = new TransactionService()
    }
    return this.instance
  }

  /**
   * Create a new transaction
   * 
   * Validates data before creation and auto-generates ID and timestamps
   * 
   * @param data - Transaction data
   * @returns Promise<Transaction> - Created transaction
   * @throws Error if validation fails
   * 
   * @example
   * const transaction = await TransactionService.createTransaction({
   *   title: 'Salary',
   *   amount: 3000,
   *   date: '2024-01-15',
   *   category: 'salary',
   *   type: 'ingreso'
   * })
   */
  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    try {
      return await measureAsync('create-transaction', async () => {
        // Validate input
        const validationResult = ValidationService.validateTransaction(data as any)
        if (!validationResult.isValid) {
          throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`)
        }

        // Create transaction object with ID and timestamps
        const transaction: Transaction = {
          id: generateId(),
          ...data,
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp()
        }

        // Save to database
        const result = await DatabaseService.create('transactions', transaction as any)
        if (!result.success) {
          throw new Error('Failed to create transaction')
        }

        return transaction
      })
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get a transaction by ID
   * 
   * @param transactionId - Transaction ID
   * @returns Promise<Transaction | null> - Transaction or null if not found
   * 
   * @example
   * const transaction = await TransactionService.getTransaction('txn-123')
   */
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    try {
      return await measureAsync('get-transaction', async () => {
        const result = await DatabaseService.getById('transactions', transactionId)
        if (result.success && result.data) {
          return result.data as Transaction
        }
        return null
      })
    } catch (error) {
      throw new Error(`Failed to get transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get all transactions
   * 
   * @returns Promise<Transaction[]> - All transactions
   * 
   * @example
   * const transactions = await TransactionService.getAllTransactions()
   */
  async getAllTransactions(): Promise<Transaction[]> {
    try {
      return await measureAsync('get-all-transactions', async () => {
        const result = await DatabaseService.getAll('transactions')
        if (result.success && result.data) {
          return result.data as Transaction[]
        }
        return []
      })
    } catch (error) {
      throw new Error(`Failed to get transactions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Filter transactions by type
   * 
   * @param type - Transaction type: 'ingreso' or 'gasto'
   * @returns Promise<Transaction[]> - Filtered transactions
   * 
   * @example
   * const expenses = await TransactionService.filterByType('gasto')
   */
  async filterByType(type: 'ingreso' | 'gasto'): Promise<Transaction[]> {
    try {
      return await measureAsync(`filter-by-type-${type}`, async () => {
        const result = await DatabaseService.query('transactions', 'type', type)
        if (result.success && result.data) {
          return result.data as Transaction[]
        }
        return []
      })
    } catch (error) {
      throw new Error(`Failed to filter transactions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Filter transactions by category
   * 
   * @param categoryId - Category ID
   * @returns Promise<Transaction[]> - Filtered transactions
   * 
   * @example
   * const groceries = await TransactionService.filterByCategory('groceries')
   */
  async filterByCategory(categoryId: string): Promise<Transaction[]> {
    try {
      return await measureAsync('filter-by-category', async () => {
        const result = await DatabaseService.query('transactions', 'category', categoryId)
        if (result.success && result.data) {
          return result.data as Transaction[]
        }
        return []
      })
    } catch (error) {
      throw new Error(`Failed to filter transactions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Filter transactions by date range
   * 
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @returns Promise<Transaction[]> - Filtered transactions
   * 
   * @example
   * const monthly = await TransactionService.filterByDateRange('2024-01-01', '2024-01-31')
   */
  async filterByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    try {
      return await measureAsync('filter-by-date-range', async () => {
        const allTransactions = await this.getAllTransactions()
        return allTransactions.filter(txn => 
          txn.date >= startDate && txn.date <= endDate
        )
      })
    } catch (error) {
      throw new Error(`Failed to filter by date: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Update an existing transaction
   * 
   * @param transactionId - Transaction ID
   * @param updates - Partial transaction data
   * @returns Promise<Transaction> - Updated transaction
   * 
   * @example
   * const updated = await TransactionService.updateTransaction('txn-123', {
   *   amount: 150,
   *   title: 'Updated title'
   * })
   */
  async updateTransaction(transactionId: string, updates: UpdateTransactionDTO): Promise<Transaction> {
    try {
      return await measureAsync('update-transaction', async () => {
        // Validate updates
        const validationResult = ValidationService.validateTransactionUpdate(updates as any)
        if (!validationResult.isValid) {
          throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`)
        }

        // Get existing transaction
        const existing = await this.getTransaction(transactionId)
        if (!existing) {
          throw new Error('Transaction not found')
        }

        // Prepare update with timestamp
        const updateData = {
          ...updates,
          updatedAt: getCurrentTimestamp()
        }

        // Update in database
        await DatabaseService.update('transactions', transactionId, updateData as any)

        // Return updated transaction
        return {
          ...existing,
          ...updateData
        } as Transaction
      })
    } catch (error) {
      throw new Error(`Failed to update transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Delete a transaction
   * 
   * @param transactionId - Transaction ID
   * @returns Promise<void>
   * 
   * @example
   * await TransactionService.deleteTransaction('txn-123')
   */
  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await measureAsync('delete-transaction', async () => {
        const exists = await this.getTransaction(transactionId)
        if (!exists) {
          throw new Error('Transaction not found')
        }
        await DatabaseService.delete('transactions', transactionId)
      })
    } catch (error) {
      throw new Error(`Failed to delete transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Create multiple transactions in bulk
   * 
   * @param transactionsData - Array of transaction data
   * @returns Promise<{ successful: Transaction[], failed: Array<{data: CreateTransactionDTO, error: string}> }>
   * 
   * @example
   * const result = await TransactionService.bulkCreateTransactions([
   *   { title: 'Txn 1', amount: 100, ... },
   *   { title: 'Txn 2', amount: 200, ... }
   * ])
   */
  async bulkCreateTransactions(transactionsData: CreateTransactionDTO[]): Promise<{
    successful: Transaction[]
    failed: Array<{ data: CreateTransactionDTO; error: string }>
  }> {
    try {
      return await measureAsync('bulk-create-transactions', async () => {
        const successful: Transaction[] = []
        const failed: Array<{ data: CreateTransactionDTO; error: string }> = []

        for (const data of transactionsData) {
          try {
            const transaction = await this.createTransaction(data)
            successful.push(transaction)
          } catch (error) {
            failed.push({
              data,
              error: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        }

        return { successful, failed }
      })
    } catch (error) {
      throw new Error(`Bulk create failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Calculate transaction statistics
   * 
   * @returns Promise<TransactionStats> - Statistics object
   * 
   * @example
   * const stats = await TransactionService.getStats()
   * console.log(`Balance: ${stats.balance}`)
   */
  async getStats(): Promise<TransactionStats> {
    try {
      return await measureAsync('calculate-stats', async () => {
        const transactions = await this.getAllTransactions()

        const ingresos = transactions.filter(t => t.type === 'ingreso')
        const gastos = transactions.filter(t => t.type === 'gasto')

        const totalIncome = ingresos.reduce((sum, t) => sum + t.amount, 0)
        const totalExpenses = gastos.reduce((sum, t) => sum + t.amount, 0)

        return {
          totalTransactions: transactions.length,
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
          averageTransaction: transactions.length > 0 
            ? (totalIncome + totalExpenses) / transactions.length 
            : 0,
          byType: {
            ingreso: {
              count: ingresos.length,
              total: totalIncome,
              average: ingresos.length > 0 ? totalIncome / ingresos.length : 0
            },
            gasto: {
              count: gastos.length,
              total: totalExpenses,
              average: gastos.length > 0 ? totalExpenses / gastos.length : 0
            }
          }
        }
      })
    } catch (error) {
      throw new Error(`Failed to calculate stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Search transactions by title
   * 
   * @param query - Search term
   * @returns Promise<Transaction[]> - Matching transactions
   * 
   * @example
   * const results = await TransactionService.search('grocery')
   */
  async search(query: string): Promise<Transaction[]> {
    try {
      const allTransactions = await this.getAllTransactions()
      const lowerQuery = query.toLowerCase()
      
      return allTransactions.filter(txn =>
        txn.title.toLowerCase().includes(lowerQuery) ||
        (txn.description && txn.description.toLowerCase().includes(lowerQuery))
      )
    } catch (error) {
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Clear all transactions (USE WITH CAUTION)
   * 
   * @returns Promise<void>
   */
  async clearAll(): Promise<void> {
    try {
      await DatabaseService.clear('transactions')
    } catch (error) {
      throw new Error(`Failed to clear transactions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Export singleton instance
export default TransactionService.getInstance()
