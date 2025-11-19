# TransactionService Contract

**Status**: Complete - Ready for Implementation  
**Target Service**: `src/services/transaction/TransactionService.ts`  
**Version**: 1.0  
**Depends On**: DatabaseService

---

## Overview

The `TransactionService` provides business logic for transaction management. It uses `DatabaseService` for data access and `ValidationService` for input validation. It handles all transaction-specific operations including CRUD, filtering, and data integrity.

---

## Public API

### Transaction Creation

#### `createTransaction(data: CreateTransactionDTO): Promise<Transaction>`

Create and save a new transaction.

**Purpose**: Add new transaction to database with full validation

**Parameters**:
```typescript
interface CreateTransactionDTO {
  title: string;               // 1-255 characters
  amount: number;              // > 0, <= 9,999,999.99, 2 decimals
  date: string;                // YYYY-MM-DD format, not future
  category: string;            // Must exist in categories
  type: "ingreso" | "gasto";
  description?: string;        // 0-1000 characters
  tags?: string[];             // 0-10 tags
}
```

**Returns**: `Promise<Transaction>` - Created transaction with ID and timestamps

**Errors**:
- `ValidationError` if input validation fails (specific field errors)
- `DatabaseError` if database operation fails
- Throws before database write if validation fails (fail-fast)

**Auto-populated Fields**:
- `id` - UUID v4 generated
- `createdAt` - Current ISO timestamp
- `updatedAt` - Current ISO timestamp

**Example**:
```typescript
const transaction = await TransactionService.createTransaction({
  title: "Grocery shopping",
  amount: 45.50,
  date: "2024-01-15",
  category: "Groceries",
  type: "gasto",
  description: "Weekly groceries",
  tags: ["food", "weekly"]
});
console.log("Created:", transaction.id);
```

**Test Cases**:
- [✓] Valid transaction: Created successfully
- [✓] Missing required field: Validation error
- [✓] Invalid amount: Validation error
- [✓] Future date: Validation error
- [✓] Invalid category: Validation error
- [✓] Database error: Propagated to caller

---

### Transaction Retrieval

#### `getTransaction(id: string): Promise<Transaction | null>`

Retrieve a single transaction by ID.

**Purpose**: Fetch specific transaction

**Parameters**:
- `id: string` - Transaction ID

**Returns**: `Promise<Transaction | null>` - Transaction or null if not found

**Errors**:
- `DatabaseError` if database operation fails

**Performance**: < 10ms

**Example**:
```typescript
const transaction = await TransactionService.getTransaction("uuid-1");
if (transaction) {
  console.log("Found:", transaction.title);
}
```

**Test Cases**:
- [✓] Existing ID: Returns transaction
- [✓] Non-existent ID: Returns null
- [✓] Database error: Throws error

---

#### `getAllTransactions(): Promise<Transaction[]>`

Retrieve all transactions.

**Purpose**: Get complete transaction history

**Parameters**: None

**Returns**: `Promise<Transaction[]>` - All transactions sorted by date descending

**Errors**:
- `DatabaseError` if database operation fails

**Performance**: < 100ms (even with 1000+ transactions)

**Sorting**: By date, newest first

**Example**:
```typescript
const transactions = await TransactionService.getAllTransactions();
console.log(`Total transactions: ${transactions.length}`);
```

**Test Cases**:
- [✓] Empty database: Returns empty array
- [✓] With transactions: Returns all, sorted by date
- [✓] Large dataset: Performance target met

---

### Transaction Filtering

#### `filterTransactions(query: TransactionQuery): Promise<TransactionQueryResult>`

Query transactions with multiple filter options.

**Purpose**: Find transactions matching specific criteria

**Parameters**:
```typescript
interface TransactionQuery {
  dateRange?: { start: string; end: string };  // YYYY-MM-DD
  category?: string;                           // Single category
  type?: "ingreso" | "gasto";                  // Income or expense
  tags?: string[];                             // All must match
  sortBy?: "date" | "amount" | "createdAt";    // Default: "date"
  sortOrder?: "asc" | "desc";                  // Default: "desc"
  offset?: number;                             // Default: 0
  limit?: number;                              // Default: undefined
}
```

**Returns**: `Promise<TransactionQueryResult>`
```typescript
interface TransactionQueryResult {
  transactions: Transaction[];
  total: number;        // Total matching records
  offset: number;
  limit?: number;
}
```

**Errors**:
- `ValidationError` if query parameters invalid
- `DatabaseError` if database operation fails

**Performance**: < 200ms even with 1000+ transactions and complex filters

**Filter Logic**:
- All specified filters are AND-ed together
- If no filters, returns all transactions
- Tags filter: ALL tags must be present (intersection)

**Example**:
```typescript
// Get all expenses from last 30 days in Groceries category
const result = await TransactionService.filterTransactions({
  type: "gasto",
  category: "Groceries",
  dateRange: {
    start: "2024-01-01",
    end: "2024-01-31"
  },
  sortBy: "date",
  sortOrder: "desc"
});
console.log(`Found ${result.total} groceries expenses`);
```

**Test Cases**:
- [✓] No filters: Returns all
- [✓] Date range filter: Correct subset
- [✓] Category filter: Only matching category
- [✓] Type filter: Only ingreso or gasto
- [✓] Combined filters: AND logic applied
- [✓] Tags filter: All tags must match
- [✓] Pagination: Offset/limit work correctly
- [✓] Sorting: By date/amount, asc/desc
- [✓] Performance: < 200ms with 1000+ records

---

### Transaction Update

#### `updateTransaction(id: string, updates: UpdateTransactionDTO): Promise<Transaction>`

Modify an existing transaction.

**Purpose**: Update transaction fields

**Parameters**:
- `id: string` - Transaction ID
- `updates: UpdateTransactionDTO` - Fields to update
  - All fields optional
  - Cannot update `id` or `createdAt`
  - Can update any of: `title`, `amount`, `date`, `category`, `type`, `description`, `tags`

```typescript
interface UpdateTransactionDTO {
  title?: string;
  amount?: number;
  date?: string;
  category?: string;
  type?: "ingreso" | "gasto";
  description?: string;
  tags?: string[];
}
```

**Returns**: `Promise<Transaction>` - Updated transaction with new `updatedAt`

**Errors**:
- `ValidationError` if new values don't pass validation
- `DatabaseError` with code `NOT_FOUND` if transaction doesn't exist
- `DatabaseError` if database operation fails
- Does NOT validate that category exists (business decision: allow orphaned category refs for Phase 1)

**Auto-updated Fields**:
- `updatedAt` - Set to current timestamp

**Example**:
```typescript
const updated = await TransactionService.updateTransaction("uuid-1", {
  amount: 50.00,
  description: "Updated amount"
});
console.log("Updated at:", updated.updatedAt);
```

**Test Cases**:
- [✓] Valid update: Successfully modified
- [✓] Non-existent ID: NOT_FOUND error
- [✓] Invalid field value: Validation error
- [✓] Partial update: Only specified fields changed
- [✓] updatedAt updated: Timestamp changed
- [✓] createdAt unchanged: Original timestamp preserved
- [✓] Cannot update id: Attempt silently ignored

---

### Transaction Deletion

#### `deleteTransaction(id: string): Promise<void>`

Remove a transaction permanently.

**Purpose**: Delete transaction from database

**Parameters**:
- `id: string` - Transaction ID

**Returns**: `Promise<void>` - Resolves on success

**Errors**:
- `DatabaseError` with code `NOT_FOUND` if transaction doesn't exist
- `DatabaseError` if database operation fails

**Side Effects**:
- Transaction completely removed (hard delete)
- Cannot be recovered in Phase 1

**Example**:
```typescript
try {
  await TransactionService.deleteTransaction("uuid-1");
  console.log("Deleted successfully");
} catch (error) {
  console.error("Delete failed:", error);
}
```

**Test Cases**:
- [✓] Existing ID: Successfully deleted
- [✓] Non-existent ID: NOT_FOUND error
- [✓] Verify deletion: Subsequent getTransaction returns null

---

### Batch Operations

#### `bulkCreateTransactions(transactions: CreateTransactionDTO[]): Promise<BulkOperationResult>`

Create multiple transactions in a single operation.

**Purpose**: Efficient bulk import

**Parameters**:
- `transactions: CreateTransactionDTO[]` - Array of transactions to create

**Returns**:
```typescript
interface BulkOperationResult {
  created: number;           // Count of successfully created
  failed: number;            // Count of failures
  errors: Array<{            // Details of failures
    index: number;
    error: string;
    data?: CreateTransactionDTO;
  }>;
}
```

**Errors**:
- Does not throw on validation failures
- Returns results with individual error details
- Throws `DatabaseError` only on catastrophic database failure

**Atomicity**:
- Phase 1: Not atomic (failures don't rollback successes)
- Phase 2: Will be atomic (all-or-nothing)

**Example**:
```typescript
const result = await TransactionService.bulkCreateTransactions([
  { title: "Salary", amount: 3000, date: "2024-01-01", category: "Salary", type: "ingreso" },
  { title: "Groceries", amount: 45.50, date: "2024-01-15", category: "Groceries", type: "gasto" },
  { title: "Invalid", amount: -10, date: "2024-01-20", category: "Unknown", type: "gasto" }
]);
console.log(`Created: ${result.created}, Failed: ${result.failed}`);
```

**Test Cases**:
- [✓] All valid: All created successfully
- [✓] Some invalid: Partial success with error details
- [✓] All invalid: All fail with error details
- [✓] Large batch: Performance acceptable

---

### Transaction Analysis

#### `getTransactionStats(): Promise<TransactionStats>`

Get statistical summary of all transactions.

**Purpose**: Provide quick overview of financial data

**Returns**:
```typescript
interface TransactionStats {
  totalTransactions: number;
  totalIncome: number;          // Sum of all ingresos
  totalExpense: number;         // Sum of all gastos
  net: number;                  // totalIncome - totalExpense
  dateRange: {
    earliest: string;           // Oldest transaction date
    latest: string;             // Newest transaction date
  };
  byCategory: {
    [categoryName: string]: {
      count: number;
      total: number;
      average: number;
    };
  };
}
```

**Errors**:
- `DatabaseError` if database operation fails

**Performance**: < 200ms with 1000+ transactions

**Example**:
```typescript
const stats = await TransactionService.getTransactionStats();
console.log(`Balance: $${stats.net}`);
console.log(`Top category: ${Object.entries(stats.byCategory)[0]}`);
```

**Test Cases**:
- [✓] Empty database: Zero totals
- [✓] Multiple transactions: Correct calculations
- [✓] By category: Accurate per-category stats

---

## Error Handling

### Validation Errors

Returned with detailed field-level information:

```typescript
throw new ValidationError({
  field: "amount",
  message: "Amount must be greater than 0",
  code: "OUT_OF_RANGE",
  value: -10
});
```

### Database Errors

Propagated from DatabaseService with context:

```typescript
throw new DatabaseError({
  code: "NOT_FOUND",
  operation: "updateTransaction",
  message: "Transaction uuid-1 not found"
});
```

### Error Recovery

- **Validation errors**: User can retry with corrected data
- **Database errors**: Application should retry (may be transient)
- **Catastrophic errors**: Application should enter safe mode (Phase 2 feature)

---

## Internal Implementation Details

### Dependency Injection

```typescript
class TransactionService {
  constructor(
    private databaseService: DatabaseService,
    private validationService: ValidationService,
    private categoryService: CategoryService
  ) {}
}
```

### Validation Flow

1. Input validation (required fields, data types)
2. Business rule validation (amount range, date not future)
3. Referential validation (category exists)
4. Database operation with error handling

### Performance Optimization

- Use database indexes for filtering
- Batch queries where possible
- Cache category lookups (Phase 2)
- Lazy-load large datasets (Phase 2)

---

## Test Requirements

### Unit Test Suite

**File**: `src/services/transaction/__tests__/TransactionService.test.ts`

**Test Coverage**: Must achieve >= 80% line coverage

**Required Test Cases**:

1. **Create Transaction Tests**
   - [✓] Valid transaction created
   - [✓] Missing required field rejected
   - [✓] Invalid amount rejected
   - [✓] Future date rejected
   - [✓] Invalid category rejected
   - [✓] UUID generated
   - [✓] Timestamps auto-populated

2. **Retrieve Transaction Tests**
   - [✓] Get existing transaction
   - [✓] Get non-existent returns null
   - [✓] Get all returns correct order
   - [✓] Get all performance with 1000+ records

3. **Filter Transaction Tests**
   - [✓] Filter by date range
   - [✓] Filter by category
   - [✓] Filter by type
   - [✓] Combined filters (AND logic)
   - [✓] Pagination (offset/limit)
   - [✓] Sorting options

4. **Update Transaction Tests**
   - [✓] Update existing transaction
   - [✓] Non-existent transaction error
   - [✓] Invalid values rejected
   - [✓] updatedAt refreshed
   - [✓] Partial updates work

5. **Delete Transaction Tests**
   - [✓] Delete existing transaction
   - [✓] Delete non-existent error
   - [✓] Verify deletion with query

6. **Bulk Operations Tests**
   - [✓] Create multiple transactions
   - [✓] Handle partial failures
   - [✓] Return error details

7. **Stats Calculation Tests**
   - [✓] Empty database stats
   - [✓] Income/expense totals correct
   - [✓] Net calculation correct
   - [✓] Per-category stats accurate

---

## Integration Notes

### Used By

- React components (via context or hooks)
- CategoryService (for category validation)
- Application initialization

### Dependencies

- DatabaseService - Low-level data access
- ValidationService - Input validation
- CategoryService - Category lookups

### Future Enhancements (Phase 2+)

- Recurring transactions
- Budget tracking
- Advanced filtering (search by text)
- Transaction tagging system
- Export/import functionality
- Data caching layer
- Undo/redo operations

---

## Sign-Off

**Contract Review**: [Date - TBD]
**Approved By**: [Name - TBD]
**Last Updated**: 2024-01-XX
