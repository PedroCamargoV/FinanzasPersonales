# DatabaseService Contract

**Status**: Complete - Ready for Implementation  
**Target Service**: `src/services/database/DatabaseService.ts`  
**Version**: 1.0

---

## Overview

The `DatabaseService` is a generic, low-level data access layer that handles all IndexedDB operations. It provides basic CRUD operations without business logic, making it reusable across different entity types (transactions, categories, etc.).

---

## Public API

### Initialization

#### `initialize(): Promise<IDBDatabase>`

Initialize the IndexedDB database and create all required object stores.

**Purpose**: Called once on app startup to ensure database is ready

**Parameters**: None

**Returns**: `Promise<IDBDatabase>` - Reference to initialized database

**Errors**:
- `DatabaseError` with code `INIT_FAILED` if initialization fails
- Includes details about which store failed

**Example**:
```typescript
try {
  const db = await DatabaseService.initialize();
  console.log("Database ready");
} catch (error) {
  console.error("Failed to initialize database:", error);
}
```

**Test Cases**:
- [✓] First load: Database created with all stores
- [✓] Second load: Database exists, no errors
- [✓] Browser limitations: Handles quota exceeded error

---

### Create

#### `create<T>(store: string, data: T): Promise<string>`

Insert a new record into an object store.

**Purpose**: Add new data to database

**Parameters**:
- `store: string` - Object store name (e.g., "transactions", "categories")
- `data: T` - Data to insert (must include `id` field)

**Returns**: `Promise<string>` - The record ID that was inserted

**Errors**:
- `DatabaseError` with code `TRANSACTION_FAILED` if insert fails
- `DatabaseError` with code `DUPLICATE_KEY` if ID already exists
- `DatabaseError` with code `QUOTA_EXCEEDED` if database is full

**Validation**:
- Record must not already exist (ID unique)
- Record must include `id` field
- Record must not have `null` or `undefined` values for required fields

**Example**:
```typescript
const transaction = {
  id: "uuid-1",
  title: "Salary",
  amount: 3000,
  date: "2024-01-15",
  category: "Salary",
  type: "ingreso",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
};

try {
  const insertedId = await DatabaseService.create("transactions", transaction);
  console.log("Created:", insertedId);
} catch (error) {
  console.error("Create failed:", error);
}
```

**Test Cases**:
- [✓] Valid record: Successfully inserted
- [✓] Duplicate ID: Throws DUPLICATE_KEY error
- [✓] Quota exceeded: Throws QUOTA_EXCEEDED error

---

### Read

#### `getById<T>(store: string, id: string): Promise<T | null>`

Retrieve a single record by ID.

**Purpose**: Fetch specific record from database

**Parameters**:
- `store: string` - Object store name
- `id: string` - Record ID

**Returns**: `Promise<T | null>` - Record if found, null otherwise

**Errors**:
- `DatabaseError` with code `TRANSACTION_FAILED` if query fails

**Performance**: Should complete in < 10ms (IndexedDB native operation)

**Example**:
```typescript
const transaction = await DatabaseService.getById("transactions", "uuid-1");
if (transaction) {
  console.log("Found:", transaction);
} else {
  console.log("Not found");
}
```

**Test Cases**:
- [✓] Existing ID: Returns record
- [✓] Non-existent ID: Returns null
- [✓] Database error: Throws error

---

#### `getAll<T>(store: string): Promise<T[]>`

Retrieve all records from an object store.

**Purpose**: Fetch all data from a store

**Parameters**:
- `store: string` - Object store name

**Returns**: `Promise<T[]>` - Array of all records (empty array if none)

**Errors**:
- `DatabaseError` with code `TRANSACTION_FAILED` if query fails

**Performance**: Should complete in < 100ms (even with 1000+ records)

**Order**: Records returned in insertion order (stable)

**Example**:
```typescript
const allTransactions = await DatabaseService.getAll("transactions");
console.log(`Found ${allTransactions.length} transactions`);
```

**Test Cases**:
- [✓] Empty store: Returns empty array
- [✓] With records: Returns all records
- [✓] Large dataset (1000+ records): Performance target met

---

#### `query<T>(store: string, indexName: string, value: any): Promise<T[]>`

Query records using an index.

**Purpose**: Efficiently find records matching a criterion

**Parameters**:
- `store: string` - Object store name
- `indexName: string` - Index name (e.g., "date", "category", "type")
- `value: any` - Value to match

**Returns**: `Promise<T[]>` - Array of matching records

**Errors**:
- `DatabaseError` with code `TRANSACTION_FAILED` if query fails
- `DatabaseError` if index doesn't exist

**Performance**: Should complete in < 50ms

**Order**: Records in index order (typically insertion order)

**Example**:
```typescript
// Get all expense transactions
const expenses = await DatabaseService.query("transactions", "type", "gasto");
console.log(`Found ${expenses.length} expenses`);
```

**Test Cases**:
- [✓] No matches: Returns empty array
- [✓] With matches: Returns all matching
- [✓] Multiple values: Only exact matches returned

---

### Update

#### `update<T>(store: string, id: string, updates: Partial<T>): Promise<void>`

Update an existing record (partial update).

**Purpose**: Modify specific fields in a record

**Parameters**:
- `store: string` - Object store name
- `id: string` - Record ID to update
- `updates: Partial<T>` - Fields to update

**Returns**: `Promise<void>` - Resolves on success

**Errors**:
- `DatabaseError` with code `NOT_FOUND` if record doesn't exist
- `DatabaseError` with code `TRANSACTION_FAILED` if update fails
- Cannot update `id` or `createdAt` (attempt silently ignored)

**Validation**:
- Record must exist before updating
- Cannot update primary key

**Side Effects**:
- Sets `updatedAt` to current timestamp (automatic)

**Example**:
```typescript
try {
  await DatabaseService.update("transactions", "uuid-1", {
    amount: 3100,
    updatedAt: new Date().toISOString()
  });
  console.log("Updated successfully");
} catch (error) {
  console.error("Update failed:", error);
}
```

**Test Cases**:
- [✓] Valid update: Successfully modified
- [✓] Non-existent ID: Throws NOT_FOUND
- [✓] Update immutable field: Silently ignored
- [✓] Partial update: Other fields unchanged

---

### Delete

#### `delete(store: string, id: string): Promise<void>`

Remove a record from database (hard delete - permanent).

**Purpose**: Completely remove a record

**Parameters**:
- `store: string` - Object store name
- `id: string` - Record ID to delete

**Returns**: `Promise<void>` - Resolves on success

**Errors**:
- `DatabaseError` with code `NOT_FOUND` if record doesn't exist
- `DatabaseError` with code `TRANSACTION_FAILED` if delete fails

**Side Effects**:
- Record completely removed (not recoverable in Phase 1)

**Example**:
```typescript
try {
  await DatabaseService.delete("transactions", "uuid-1");
  console.log("Deleted successfully");
} catch (error) {
  console.error("Delete failed:", error);
}
```

**Test Cases**:
- [✓] Existing ID: Successfully deleted
- [✓] Non-existent ID: Throws NOT_FOUND
- [✓] Verify deletion: Subsequent getById returns null

---

#### `clear(store: string): Promise<void>`

Remove all records from an object store.

**Purpose**: Bulk delete for resetting data

**Parameters**:
- `store: string` - Object store name

**Returns**: `Promise<void>` - Resolves on success

**Errors**:
- `DatabaseError` with code `TRANSACTION_FAILED` if clear fails

**Caution**: This operation cannot be undone in Phase 1

**Example**:
```typescript
// WARNING: This deletes all transactions
await DatabaseService.clear("transactions");
```

**Test Cases**:
- [✓] After clear: getAll returns empty array
- [✓] Database still usable: Can insert after clear

---

## Internal Implementation Details

### IndexedDB Transaction Management

All operations use IndexedDB transactions with automatic rollback on error:

```javascript
db.transaction([storeName], mode)
  .objectStore(storeName)
  .operation()
```

**Read operations**: Mode = `readonly`
**Write operations**: Mode = `readwrite`

### Error Handling Pattern

```typescript
// All operations follow this pattern:
try {
  const request = /* perform operation */;
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new DatabaseError(...));
  });
} catch (error) {
  throw new DatabaseError(...)
}
```

### Performance Considerations

- Indexes used for filtering queries (< 50ms)
- Cursor-based iteration for large datasets
- No memory buffering (stream-based)
- Connection pooling: Not applicable (single IDB connection per database)

---

## Test Requirements

### Unit Test Suite

**File**: `src/services/database/__tests__/DatabaseService.test.ts`

**Test Coverage**: Must achieve >= 80% line coverage

**Required Test Cases**:

1. **Initialization Tests**
   - [✓] Database created on first load
   - [✓] All stores initialized
   - [✓] All indexes created
   - [✓] Database already exists (no error)
   - [✓] Quota exceeded error handling

2. **Create Tests**
   - [✓] Successfully insert valid record
   - [✓] Reject duplicate ID
   - [✓] Return inserted ID
   - [✓] Reject missing required fields
   - [✓] Quota exceeded error

3. **Read Tests**
   - [✓] getById existing record returns it
   - [✓] getById non-existent returns null
   - [✓] getAll with 0 records returns empty array
   - [✓] getAll with 100+ records returns all
   - [✓] query with matching records
   - [✓] query with no matches returns empty array

4. **Update Tests**
   - [✓] Successfully update existing record
   - [✓] Cannot update non-existent record
   - [✓] Partial update preserves other fields
   - [✓] Cannot update immutable fields (id, createdAt)
   - [✓] updatedAt automatically set

5. **Delete Tests**
   - [✓] Successfully delete existing record
   - [✓] Cannot delete non-existent record
   - [✓] Subsequent getById returns null
   - [✓] clear removes all records
   - [✓] After clear, getAll returns empty

6. **Performance Tests**
   - [✓] getById completes in < 10ms
   - [✓] getAll (1000 records) completes in < 100ms
   - [✓] query completes in < 50ms

---

## Integration Notes

### Used By

- `TransactionService` - Uses for transaction CRUD
- `CategoryService` - Uses for category operations
- Any future services needing database access

### Dependencies

- IndexedDB API (native browser)
- `uuid` package (for ID generation in calling code)

### Future Enhancements (Phase 2+)

- Pagination support
- Complex queries (multiple indexes)
- Encryption at rest
- Offline-first sync
- Data backup/restore
- Transaction batching

---

## Sign-Off

**Contract Review**: [Date - TBD]
**Approved By**: [Name - TBD]
**Last Updated**: 2024-01-XX
