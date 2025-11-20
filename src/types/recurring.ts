export type RecurrenceFrequency = 'weekly' | 'biweekly' | 'monthly' | 'yearly'

export interface RecurringTransaction {
  id: string
  title: string
  amount: number
  type: 'ingreso' | 'gasto'
  category: string
  description?: string
  frequency: RecurrenceFrequency
  startDate: Date
  endDate?: Date
  isActive: boolean
  lastGeneratedDate?: Date
  createdAt: Date
  updatedAt: Date
}
