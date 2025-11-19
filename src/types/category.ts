import { TransactionType } from './transaction'

/**
 * Represents a transaction category with optional subcategories
 *
 * @example
 * const category: Category = {
 *   id: "housing-rent",
 *   name: "Rent",
 *   type: "gasto",
 *   parentCategory: "Housing",
 *   icon: "home",
 *   color: "#FF6B6B",
 *   isSystemDefined: true,
 *   createdAt: "2024-01-01T00:00:00Z",
 *   updatedAt: "2024-01-01T00:00:00Z"
 * }
 */
export interface Category {
  /** Unique identifier (system uses kebab-case format) */
  id: string

  /** Category display name (1-100 characters) */
  name: string

  /** Category type */
  type: TransactionType

  /** Parent category for subcategories (null if top-level) */
  parentCategory?: string

  /** Icon identifier (for UI rendering, Lucide icon name) */
  icon?: string

  /** Color hex code (for UI highlighting) */
  color?: string

  /** Cannot be edited or deleted if true */
  isSystemDefined: boolean

  /** Auto-generated timestamp (ISO 8601) */
  createdAt: string

  /** Auto-updated timestamp (ISO 8601) */
  updatedAt: string
}

/**
 * Income categories (8 total)
 */
export const INCOME_CATEGORIES: Category[] = [
  {
    id: 'salary',
    name: 'Salary',
    type: 'ingreso',
    icon: 'briefcase',
    color: '#4CAF50',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    type: 'ingreso',
    icon: 'laptop',
    color: '#4CAF50',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'investment',
    name: 'Investment',
    type: 'ingreso',
    icon: 'trending-up',
    color: '#4CAF50',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'gifts',
    name: 'Gifts',
    type: 'ingreso',
    icon: 'gift',
    color: '#4CAF50',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'refund',
    name: 'Refund',
    type: 'ingreso',
    icon: 'arrow-left',
    color: '#4CAF50',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'interest',
    name: 'Interest',
    type: 'ingreso',
    icon: 'percent',
    color: '#4CAF50',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'bonus',
    name: 'Bonus',
    type: 'ingreso',
    icon: 'star',
    color: '#4CAF50',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'other-income',
    name: 'Other Income',
    type: 'ingreso',
    icon: 'more-horizontal',
    color: '#4CAF50',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

/**
 * Expense categories (17 total) with subcategories
 */
export const EXPENSE_CATEGORIES: Category[] = [
  // Housing (parent)
  {
    id: 'housing',
    name: 'Housing',
    type: 'gasto',
    icon: 'home',
    color: '#FF6B6B',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Housing subcategories
  {
    id: 'rent',
    name: 'Rent',
    type: 'gasto',
    parentCategory: 'housing',
    icon: 'home',
    color: '#FF6B6B',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    type: 'gasto',
    parentCategory: 'housing',
    icon: 'zap',
    color: '#FF6B6B',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    type: 'gasto',
    parentCategory: 'housing',
    icon: 'wrench',
    color: '#FF6B6B',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Transportation (parent)
  {
    id: 'transportation',
    name: 'Transportation',
    type: 'gasto',
    icon: 'car',
    color: '#2196F3',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Transportation subcategories
  {
    id: 'gas',
    name: 'Gas',
    type: 'gasto',
    parentCategory: 'transportation',
    icon: 'fuel',
    color: '#2196F3',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'car-maintenance',
    name: 'Car Maintenance',
    type: 'gasto',
    parentCategory: 'transportation',
    icon: 'wrench',
    color: '#2196F3',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'public-transport',
    name: 'Public Transport',
    type: 'gasto',
    parentCategory: 'transportation',
    icon: 'bus',
    color: '#2196F3',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'parking',
    name: 'Parking',
    type: 'gasto',
    parentCategory: 'transportation',
    icon: 'square',
    color: '#2196F3',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Food (parent)
  {
    id: 'food',
    name: 'Food',
    type: 'gasto',
    icon: 'utensils',
    color: '#FF9800',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Food subcategories
  {
    id: 'groceries',
    name: 'Groceries',
    type: 'gasto',
    parentCategory: 'food',
    icon: 'shopping-cart',
    color: '#FF9800',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    type: 'gasto',
    parentCategory: 'food',
    icon: 'utensils',
    color: '#FF9800',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'delivery',
    name: 'Delivery',
    type: 'gasto',
    parentCategory: 'food',
    icon: 'truck',
    color: '#FF9800',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Personal (parent)
  {
    id: 'personal',
    name: 'Personal',
    type: 'gasto',
    icon: 'user',
    color: '#9C27B0',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Personal subcategories
  {
    id: 'clothing',
    name: 'Clothing',
    type: 'gasto',
    parentCategory: 'personal',
    icon: 'shirt',
    color: '#9C27B0',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'hygiene',
    name: 'Hygiene',
    type: 'gasto',
    parentCategory: 'personal',
    icon: 'droplet',
    color: '#9C27B0',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'health',
    name: 'Health',
    type: 'gasto',
    parentCategory: 'personal',
    icon: 'heart',
    color: '#9C27B0',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Entertainment (parent)
  {
    id: 'entertainment',
    name: 'Entertainment',
    type: 'gasto',
    icon: 'play',
    color: '#FF1744',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Entertainment subcategories
  {
    id: 'movies',
    name: 'Movies',
    type: 'gasto',
    parentCategory: 'entertainment',
    icon: 'film',
    color: '#FF1744',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'games',
    name: 'Games',
    type: 'gasto',
    parentCategory: 'entertainment',
    icon: 'gamepad',
    color: '#FF1744',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sports',
    name: 'Sports',
    type: 'gasto',
    parentCategory: 'entertainment',
    icon: 'activity',
    color: '#FF1744',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Subscriptions
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    type: 'gasto',
    icon: 'repeat',
    color: '#00BCD4',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },

  // Other
  {
    id: 'other-expense',
    name: 'Other',
    type: 'gasto',
    icon: 'more-horizontal',
    color: '#9E9E9E',
    isSystemDefined: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

/**
 * Query options for filtering transactions
 */
export interface TransactionQuery {
  dateRange?: {
    start: string // YYYY-MM-DD
    end: string // YYYY-MM-DD
  }
  category?: string
  type?: TransactionType
  tags?: string[]
  sortBy?: 'date' | 'amount' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  offset?: number
  limit?: number
}
