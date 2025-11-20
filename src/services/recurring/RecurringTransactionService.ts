import { DatabaseService } from '@/services/database/DatabaseService'
import type { RecurringTransaction, Transaction } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export class RecurringTransactionService {
  private static readonly STORE_NAME = 'recurring_transactions'

  /**
   * Initialize recurring transactions store
   */
  static async initialize(): Promise<void> {
    // Ensure database is initialized
    await DatabaseService.initialize()
  }

  /**
   * Create a new recurring transaction
   */
  static async createRecurring(
    title: string,
    amount: number,
    type: 'ingreso' | 'gasto',
    category: string,
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'yearly',
    startDate: Date,
    endDate?: Date,
    description?: string
  ): Promise<RecurringTransaction> {
    const id = `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const recurring: RecurringTransaction = {
      id,
      title,
      amount,
      type,
      category,
      description,
      frequency,
      startDate,
      endDate,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await DatabaseService.create(this.STORE_NAME, recurring as any)
    return recurring
  }

  /**
   * Get all recurring transactions
   */
  static async getAllRecurring(): Promise<RecurringTransaction[]> {
    const result = await DatabaseService.getAll(this.STORE_NAME)
    return ((result as any) || []) as RecurringTransaction[]
  }

  /**
   * Get active recurring transactions
   */
  static async getActiveRecurring(): Promise<RecurringTransaction[]> {
    const all = await this.getAllRecurring()
    return all.filter(r => r.isActive)
  }

  /**
   * Get recurring transaction by ID
   */
  static async getRecurringById(id: string): Promise<RecurringTransaction | null> {
    const result = await DatabaseService.getById(this.STORE_NAME, id)
    return ((result as any) || null) as RecurringTransaction | null
  }

  /**
   * Update recurring transaction
   */
  static async updateRecurring(
    id: string,
    updates: Partial<RecurringTransaction>
  ): Promise<RecurringTransaction> {
    const existing = await this.getRecurringById(id)
    if (!existing) {
      throw new Error(`Recurring transaction ${id} not found`)
    }

    const updated: RecurringTransaction = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    }

    await DatabaseService.update(this.STORE_NAME, id, updated as any)
    return updated
  }

  /**
   * Delete recurring transaction
   */
  static async deleteRecurring(id: string): Promise<void> {
    await DatabaseService.delete(this.STORE_NAME, id)
  }

  /**
   * Toggle recurring transaction active status
   */
  static async toggleRecurring(id: string): Promise<RecurringTransaction> {
    const recurring = await this.getRecurringById(id)
    if (!recurring) {
      throw new Error(`Recurring transaction ${id} not found`)
    }

    return this.updateRecurring(id, {
      isActive: !recurring.isActive,
    })
  }

  /**
   * Calculate next generation date based on frequency
   */
  static getNextGenerationDate(startDate: Date, frequency: string): Date {
    const date = new Date(startDate)

    switch (frequency) {
      case 'weekly':
        date.setDate(date.getDate() + 7)
        break
      case 'biweekly':
        date.setDate(date.getDate() + 14)
        break
      case 'monthly':
        date.setMonth(date.getMonth() + 1)
        break
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1)
        break
      default:
        throw new Error(`Unknown frequency: ${frequency}`)
    }

    return date
  }

  /**
   * Generate transactions from recurring rules
   * This should be called periodically to create actual transactions
   */
  static async generateTransactions(): Promise<any[]> {
    const active = await this.getActiveRecurring()
    const now = new Date()
    const generated: Transaction[] = []

    for (const recurring of active) {
      // Check if it's time to generate a new transaction
      const lastGenerated = recurring.lastGeneratedDate
        ? new Date(recurring.lastGeneratedDate)
        : new Date(recurring.startDate)

      const nextGeneration = this.getNextGenerationDate(lastGenerated, recurring.frequency)

      // Check if end date has passed
      if (recurring.endDate && now > new Date(recurring.endDate)) {
        await this.updateRecurring(recurring.id, { isActive: false })
        continue
      }

      // If it's time to generate, create the transaction
      if (now >= nextGeneration) {
        const transactionId = uuidv4()
        const transaction: any = {
          id: transactionId,
          title: recurring.title,
          amount: recurring.amount,
          type: recurring.type,
          category: recurring.category,
          description: `[Recurrente] ${recurring.description || recurring.title}`,
          date: now.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        }

        // Save the transaction
        const result = await DatabaseService.create('transactions', transaction)

        if (result) {
          // Update last generated date
          await this.updateRecurring(recurring.id, {
            lastGeneratedDate: now,
          } as Partial<RecurringTransaction>)
          generated.push(transaction)
        }
      }
    }

    return generated
  }

  /**
   * Check if any transactions should be generated on app startup
   */
  static async autoGenerate(): Promise<void> {
    try {
      await this.generateTransactions()
    } catch (err) {
      console.error('Error auto-generating recurring transactions:', err)
    }
  }
}
