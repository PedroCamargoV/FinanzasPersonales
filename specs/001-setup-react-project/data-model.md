# Data Model: Phase 1 - Type Definitions

**Feature**: 001-setup-react-project  
**Status**: Complete - Ready for Implementation  
**Created**: 2024-01-XX

---

## Overview

This document defines all TypeScript interfaces and data structures for Phase 1. These interfaces represent the single source of truth for data validation, API contracts, and database schema.

---

## Core Types

### Transaction Interface

```typescript
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
interface Transaction {
  // Unique identifier (UUID v4)
  id: string;

  // Transaction title/description (1-255 characters)
  title: string;

  // Monetary amount (positive, max 2 decimal places)
  // Range: 0.01 to 9,999,999.99
  amount: number;

  // Transaction date (ISO 8601: YYYY-MM-DD)
  // Must not be a future date
  date: string;

  // Category name (must reference existing category)
  category: string;

  // Transaction type
  type: TransactionType;

  // Optional description (0-1000 characters)
  description?: string;

  // Optional tags for custom organization
  tags?: string[];

  // Auto-generated timestamp (ISO 8601)
  createdAt: string;

  // Auto-updated timestamp (ISO 8601)
  // Updates whenever any field changes
  updatedAt: string;
}
```

### Transaction Type Union

```typescript
/**
 * Represents the two transaction types
 */
type TransactionType = "ingreso" | "gasto";

/**
 * Convenience type for narrowing transaction type
 */
type IncomeTransaction = Transaction & { type: "ingreso" };
type ExpenseTransaction = Transaction & { type: "gasto" };
```

### Category Interface

```typescript
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
interface Category {
  // Unique identifier (system uses kebab-case format)
  id: string;

  // Category display name (1-100 characters)
  name: string;

  // Category type
  type: TransactionType;

  // Parent category for subcategories (null if top-level)
  parentCategory?: string;

  // Icon identifier (for UI rendering)
  icon?: string;

  // Color hex code (for UI highlighting)
  color?: string;

  // Cannot be edited or deleted if true
  isSystemDefined: boolean;

  // Auto-generated timestamp (ISO 8601)
  createdAt: string;

  // Auto-updated timestamp (ISO 8601)
  updatedAt: string;
}
```

### Predefined Categories Data

#### Income Categories (8 total)

```typescript
const INCOME_CATEGORIES: Category[] = [
  {
    id: "salary",
    name: "Salary",
    type: "ingreso",
    icon: "briefcase",
    color: "#4CAF50",
    isSystemDefined: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "freelance",
    name: "Freelance",
    type: "ingreso",
    icon: "laptop",
    color: "#4CAF50",
    isSystemDefined: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "investment",
    name: "Investment",
    type: "ingreso",
    icon: "trending-up",
    color: "#4CAF50",
    isSystemDefined: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "gifts",
    name: "Gifts",
    type: "ingreso",
    icon: "gift",
    color: "#4CAF50",
    isSystemDefined: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "refund",
    name: "Refund",
    type: "ingreso",
    icon: "arrow-left",
    color: "#4CAF50",
    isSystemDefined: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "interest",
    name: "Interest",
    type: "ingreso",
    icon: "percent",
    color: "#4CAF50",
    isSystemDefined: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "bonus",
    name: "Bonus",
    type: "ingreso",
    icon: "star",
    color: "#4CAF50",
    isSystemDefined: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "other-income",
    name: "Other Income",
    type: "ingreso",
    icon: "more-horizontal",
    color: "#4CAF50",
    isSystemDefined: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];
```

#### Expense Categories (17 total)

```typescript
const EXPENSE_CATEGORIES: Category[] = [
  // Housing (3 subcategories)
  { id: "housing", name: "Housing", type: "gasto", icon: "home", color: "#FF6B6B", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "rent", name: "Rent", type: "gasto", parentCategory: "Housing", icon: "home", color: "#FF6B6B", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "utilities", name: "Utilities", type: "gasto", parentCategory: "Housing", icon: "zap", color: "#FF6B6B", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "maintenance", name: "Maintenance", type: "gasto", parentCategory: "Housing", icon: "wrench", color: "#FF6B6B", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },

  // Transportation (4 subcategories)
  { id: "transportation", name: "Transportation", type: "gasto", icon: "car", color: "#2196F3", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "gas", name: "Gas", type: "gasto", parentCategory: "Transportation", icon: "fuel", color: "#2196F3", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "car-maintenance", name: "Car Maintenance", type: "gasto", parentCategory: "Transportation", icon: "wrench", color: "#2196F3", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "public-transport", name: "Public Transport", type: "gasto", parentCategory: "Transportation", icon: "bus", color: "#2196F3", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "parking", name: "Parking", type: "gasto", parentCategory: "Transportation", icon: "square", color: "#2196F3", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },

  // Food (3 subcategories)
  { id: "food", name: "Food", type: "gasto", icon: "utensils", color: "#FF9800", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "groceries", name: "Groceries", type: "gasto", parentCategory: "Food", icon: "shopping-cart", color: "#FF9800", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "restaurants", name: "Restaurants", type: "gasto", parentCategory: "Food", icon: "utensils", color: "#FF9800", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "delivery", name: "Delivery", type: "gasto", parentCategory: "Food", icon: "truck", color: "#FF9800", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },

  // Personal (3 subcategories)
  { id: "personal", name: "Personal", type: "gasto", icon: "user", color: "#9C27B0", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "clothing", name: "Clothing", type: "gasto", parentCategory: "Personal", icon: "shirt", color: "#9C27B0", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "hygiene", name: "Hygiene", type: "gasto", parentCategory: "Personal", icon: "droplet", color: "#9C27B0", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "health", name: "Health", type: "gasto", parentCategory: "Personal", icon: "heart", color: "#9C27B0", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },

  // Entertainment (2 subcategories)
  { id: "entertainment", name: "Entertainment", type: "gasto", icon: "play", color: "#FF1744", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "movies", name: "Movies", type: "gasto", parentCategory: "Entertainment", icon: "film", color: "#FF1744", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "games", name: "Games", type: "gasto", parentCategory: "Entertainment", icon: "gamepad", color: "#FF1744", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },
  { id: "sports", name: "Sports", type: "gasto", parentCategory: "Entertainment", icon: "activity", color: "#FF1744", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },

  // Subscriptions (1 category - will have details in Phase 2)
  { id: "subscriptions", name: "Subscriptions", type: "gasto", icon: "repeat", color: "#00BCD4", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" },

  // Other (catch-all)
  { id: "other-expense", name: "Other", type: "gasto", icon: "more-horizontal", color: "#9E9E9E", isSystemDefined: true, createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z" }
];
```

---

## Database Types

### IndexedDB Configuration

```typescript
/**
 * Database configuration for IndexedDB
 */
interface DBConfig {
  name: string;
  version: number;
  stores: DBStoreConfig[];
}

/**
 * Configuration for a single object store
 */
interface DBStoreConfig {
  name: string;
  keyPath: string;
  indexes?: DBIndexConfig[];
}

/**
 * Configuration for an object store index
 */
interface DBIndexConfig {
  name: string;
  keyPath: string | string[];
  options?: {
    unique?: boolean;
    multiEntry?: boolean;
  };
}

/**
 * Phase 1 database configuration
 */
const DB_CONFIG: DBConfig = {
  name: "finanzas-personales",
  version: 1,
  stores: [
    {
      name: "transactions",
      keyPath: "id",
      indexes: [
        {
          name: "date",
          keyPath: "date"
        },
        {
          name: "category",
          keyPath: "category"
        },
        {
          name: "type",
          keyPath: "type"
        }
      ]
    },
    {
      name: "categories",
      keyPath: "id",
      indexes: [
        {
          name: "type",
          keyPath: "type"
        },
        {
          name: "isSystemDefined",
          keyPath: "isSystemDefined"
        }
      ]
    }
  ]
};
```

---

## Validation Rules

### Transaction Validation

```typescript
/**
 * Validation schema for transactions
 */
interface TransactionValidationRules {
  title: {
    minLength: number;           // 1
    maxLength: number;           // 255
    pattern?: RegExp;
  };
  amount: {
    min: number;                 // 0.01
    max: number;                 // 9,999,999.99
    decimalPlaces: number;       // 2
  };
  date: {
    format: string;              // "YYYY-MM-DD"
    notFuture: boolean;          // true
  };
  category: {
    mustExist: boolean;          // true
  };
  type: {
    enum: TransactionType[];     // ["ingreso", "gasto"]
  };
  description: {
    maxLength: number;           // 1000
  };
}

const TRANSACTION_VALIDATION: TransactionValidationRules = {
  title: {
    minLength: 1,
    maxLength: 255
  },
  amount: {
    min: 0.01,
    max: 9999999.99,
    decimalPlaces: 2
  },
  date: {
    format: "YYYY-MM-DD",
    notFuture: true
  },
  category: {
    mustExist: true
  },
  type: {
    enum: ["ingreso", "gasto"]
  },
  description: {
    maxLength: 1000
  }
};
```

---

## Error Types

### Validation Error

```typescript
/**
 * Represents a validation error with field and reason
 */
interface ValidationError {
  field: string;
  message: string;
  code: ValidationErrorCode;
  value?: any;
}

type ValidationErrorCode =
  | "REQUIRED"
  | "INVALID_FORMAT"
  | "OUT_OF_RANGE"
  | "DUPLICATE"
  | "NOT_FOUND"
  | "INVALID_TYPE";

/**
 * Result of validation operation
 */
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
```

### Database Error

```typescript
/**
 * Represents a database operation error
 */
interface DatabaseError extends Error {
  code: DatabaseErrorCode;
  operation: string;
  details?: any;
}

type DatabaseErrorCode =
  | "INIT_FAILED"
  | "TRANSACTION_FAILED"
  | "NOT_FOUND"
  | "DUPLICATE_KEY"
  | "QUOTA_EXCEEDED"
  | "UNKNOWN";
```

---

## Query Types

### Transaction Query

```typescript
/**
 * Options for querying transactions
 */
interface TransactionQuery {
  // Filters
  dateRange?: {
    start: string;  // YYYY-MM-DD
    end: string;    // YYYY-MM-DD
  };
  category?: string;
  type?: TransactionType;
  tags?: string[];

  // Pagination
  offset?: number;  // Default: 0
  limit?: number;   // Default: undefined (no limit)

  // Sorting
  sortBy?: "date" | "amount" | "createdAt";  // Default: "date"
  sortOrder?: "asc" | "desc";                  // Default: "desc"
}

/**
 * Result of a transaction query
 */
interface TransactionQueryResult {
  transactions: Transaction[];
  total: number;
  offset: number;
  limit?: number;
}
```

---

## Relationship Diagrams

### Entity Relationship

```
┌─────────────────────┐         ┌──────────────────┐
│   Transaction       │         │    Category      │
├─────────────────────┤         ├──────────────────┤
│ id (PK)             │         │ id (PK)          │
│ title               │    ┌────→ name             │
│ amount              │    │    │ type             │
│ date                │    │    │ isSystemDefined  │
│ category (FK) ──────┘    │    │ createdAt        │
│ type                     │    │ updatedAt        │
│ description              │    └──────────────────┘
│ tags                     │
│ createdAt                │
│ updatedAt                │
└─────────────────────┘

Relationship: Many-to-One
- Many Transactions can reference one Category
- Cannot reference non-existent Category
- Deleting Category may cascade to Transactions (Phase 2 decision)
```

---

## Data Model Evolution

### Phase 1 (Current)
- Simple transaction and category models
- No user accounts (single-user per browser)
- No data sync across devices
- No soft deletes

### Phase 2 (Planned)
- User authentication and accounts
- Multi-device sync via backend API
- Soft deletes with recovery
- Custom categories (user-created)
- Budget and recurring transactions
- Data export/import

### Phase 3+ (Future)
- Reports and analytics
- Sharing and collaboration
- Advanced filtering and searching
- Mobile app support

---

## Sign-Off

**Data Model Review**: [Date - TBD]
**Model Approved By**: [Name - TBD]
**Last Updated**: 2024-01-XX
