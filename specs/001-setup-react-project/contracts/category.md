# CategoryService Contract

**Status**: Complete - Ready for Implementation  
**Target Service**: `src/services/category/CategoryService.ts`  
**Version**: 1.0  
**Depends On**: DatabaseService

---

## Overview

The `CategoryService` manages predefined transaction categories. Its primary responsibility is initializing the 25 system-defined categories on first app load and providing efficient category lookup operations. Categories cannot be modified or deleted in Phase 1 (they are immutable system data).

---

## Public API

### Initialization

#### `initializeCategories(): Promise<void>`

Initialize system-defined categories on first app load.

**Purpose**: Populate categories object store with predefined income and expense categories

**Parameters**: None

**Returns**: `Promise<void>` - Resolves when initialization complete

**Errors**:
- `DatabaseError` if database operation fails
- Does not error if categories already exist (idempotent)

**Idempotency**: Safe to call multiple times - will not create duplicates

**Categories Created**:
- 8 income categories
- 17 expense categories with hierarchical structure
- All marked as `isSystemDefined: true`

**Performance**: < 500ms first load, < 10ms subsequent loads

**Example**:
```typescript
try {
  await CategoryService.initializeCategories();
  console.log("Categories initialized");
} catch (error) {
  console.error("Initialization failed:", error);
}
```

**Test Cases**:
- [✓] First load: 25 categories created
- [✓] Second load: No duplicates created (idempotent)
- [✓] After clear: Can initialize again
- [✓] Database error: Properly propagated

---

### Category Retrieval

#### `getCategory(id: string): Promise<Category | null>`

Retrieve a single category by ID.

**Purpose**: Look up specific category by its ID

**Parameters**:
- `id: string` - Category ID (e.g., "salary", "groceries")

**Returns**: `Promise<Category | null>` - Category if found, null otherwise

**Errors**:
- `DatabaseError` if database operation fails

**Performance**: < 10ms

**Example**:
```typescript
const groceries = await CategoryService.getCategory("groceries");
if (groceries) {
  console.log(`Found: ${groceries.name}`);
}
```

**Test Cases**:
- [✓] Existing category: Returns it
- [✓] Non-existent ID: Returns null
- [✓] Database error: Throws error

---

#### `getAllCategories(): Promise<Category[]>`

Retrieve all categories.

**Purpose**: Get complete category list for UI population

**Parameters**: None

**Returns**: `Promise<Category[]>` - All 25 predefined categories

**Errors**:
- `DatabaseError` if database operation fails

**Performance**: < 20ms

**Ordering**: Returned in insertion order (stable)

**Example**:
```typescript
const categories = await CategoryService.getAllCategories();
console.log(`Total categories: ${categories.length}`);
```

**Test Cases**:
- [✓] Returns all 25 categories
- [✓] Consistent ordering
- [✓] All have isSystemDefined = true

---

#### `getCategoriesByType(type: TransactionType): Promise<Category[]>`

Retrieve all categories of a specific type.

**Purpose**: Get filtered category list for transaction creation UI

**Parameters**:
- `type: "ingreso" | "gasto"` - Transaction type

**Returns**: `Promise<Category[]>` - Categories of that type only

**Errors**:
- `DatabaseError` if database operation fails

**Expected Results**:
- If `type = "ingreso"`: Returns 8 income categories
- If `type = "gasto"`: Returns 17 expense categories (including parent and child)

**Performance**: < 30ms

**Example**:
```typescript
// Get all expense categories for dropdown
const expenseCategories = await CategoryService.getCategoriesByType("gasto");
const groupedByParent = groupBy(expenseCategories, "parentCategory");
```

**Test Cases**:
- [✓] Income type: Returns 8 categories
- [✓] Expense type: Returns 17 categories
- [✓] Ordering consistent
- [✓] All results have correct type

---

#### `getSubcategories(parentId: string): Promise<Category[]>`

Retrieve all subcategories under a parent category.

**Purpose**: Get child categories for hierarchical UI

**Parameters**:
- `parentId: string` - Parent category ID (e.g., "housing")

**Returns**: `Promise<Category[]>` - All direct subcategories (one level deep)

**Errors**:
- `DatabaseError` if database operation fails
- Returns empty array if parent doesn't exist or has no children

**Performance**: < 20ms

**Example**:
```typescript
const housingSubcats = await CategoryService.getSubcategories("housing");
// Returns: [Rent, Utilities, Maintenance]
```

**Test Cases**:
- [✓] Parent with children: Returns all subcategories
- [✓] Parent without children: Returns empty array
- [✓] Non-existent parent: Returns empty array
- [✓] Only direct children returned (one level)

---

### Category Validation

#### `validateCategoryExists(categoryId: string): Promise<boolean>`

Verify that a category exists in the system.

**Purpose**: Used for transaction validation (category must exist)

**Parameters**:
- `categoryId: string` - Category ID to verify

**Returns**: `Promise<boolean>` - True if exists, false otherwise

**Errors**:
- `DatabaseError` if database operation fails

**Performance**: < 10ms (uses database index)

**Example**:
```typescript
const isValid = await CategoryService.validateCategoryExists("groceries");
if (!isValid) {
  throw new ValidationError({
    field: "category",
    message: "Category does not exist",
    code: "NOT_FOUND"
  });
}
```

**Test Cases**:
- [✓] Existing category: Returns true
- [✓] Non-existent category: Returns false
- [✓] Database error: Throws error

---

### Category Search

#### `searchCategories(query: string): Promise<Category[]>`

Search categories by name (partial match).

**Purpose**: Quick lookup or autocomplete functionality (Phase 2)

**Parameters**:
- `query: string` - Search term (case-insensitive)

**Returns**: `Promise<Category[]>` - Matching categories

**Errors**:
- `DatabaseError` if database operation fails

**Performance**: < 50ms even with many categories

**Matching Logic**:
- Case-insensitive substring match
- Returns in relevance order (best matches first)
- Empty query returns all categories

**Example**:
```typescript
// Search for categories containing "trans"
const results = await CategoryService.searchCategories("trans");
// Returns: [Transportation, Public Transport]
```

**Test Cases**:
- [✓] Exact match: Found
- [✓] Partial match: Found (substring)
- [✓] Case-insensitive: Works with different cases
- [✓] No matches: Returns empty array
- [✓] Empty query: Returns all

---

## Category Structure Reference

### Income Categories

1. Salary
2. Freelance
3. Investment
4. Gifts
5. Refund
6. Interest
7. Bonus
8. Other Income

### Expense Categories (Hierarchical)

**Housing**
- Rent
- Utilities
- Maintenance

**Transportation**
- Gas
- Car Maintenance
- Public Transport
- Parking

**Food**
- Groceries
- Restaurants
- Delivery

**Personal**
- Clothing
- Hygiene
- Health

**Entertainment**
- Movies
- Games
- Sports

**Subscriptions** (no subcategories in Phase 1)

**Other** (catch-all)

---

## Data Structure

Each category follows this structure:

```typescript
interface Category {
  id: string;                    // kebab-case identifier
  name: string;                  // Display name
  type: "ingreso" | "gasto";     // Transaction type
  parentCategory?: string;       // Parent category ID (for subcategories)
  icon?: string;                 // Lucide icon name
  color?: string;                // Hex color code
  isSystemDefined: boolean;      // Always true in Phase 1
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

---

## Constraints

### Phase 1 Constraints

- Categories are **immutable** (cannot be edited or deleted)
- Only system-defined categories exist
- Users cannot create custom categories (Phase 2 feature)
- No category renaming or customization
- Category list is fixed at 25 items

### Hierarchy Limits

- Two-level hierarchy only (parent → child)
- Not all categories have subcategories
- Subcategories can exist for expenses only (income categories are flat)

---

## Error Handling

### Not Found Errors

```typescript
// Attempting to get non-existent category
const cat = await CategoryService.getCategory("invalid-id");
// Returns: null (not an error)
```

### Database Errors

```typescript
// Database operation fails
throw new DatabaseError({
  code: "TRANSACTION_FAILED",
  operation: "getAllCategories",
  message: "Failed to query categories from IndexedDB"
});
```

### Validation Errors

Used by TransactionService to validate category references:

```typescript
const isValid = await CategoryService.validateCategoryExists("invalid");
// Returns: false (not an error)
```

---

## Internal Implementation Details

### Lazy Loading

First call to any method triggers initialization if not done:

```typescript
// Internal implementation
async getAll() {
  if (!this.initialized) {
    await this.initializeCategories();
  }
  return this.databaseService.getAll("categories");
}
```

### Caching Strategy (Phase 1)

- Phase 1: No caching (direct database queries)
- Phase 2: Consider in-memory cache (categories never change)

### Query Optimization

- Use database indexes on `type` and `isSystemDefined`
- For hierarchical queries, filter in memory (small dataset)

---

## Test Requirements

### Unit Test Suite

**File**: `src/services/category/__tests__/CategoryService.test.ts`

**Test Coverage**: Must achieve >= 80% line coverage

**Required Test Cases**:

1. **Initialization Tests**
   - [✓] Creates 25 categories on first call
   - [✓] Idempotent (no duplicates on retry)
   - [✓] Income categories correct (8 total)
   - [✓] Expense categories correct (17 total)
   - [✓] Hierarchy relationships correct
   - [✓] System flag set true for all
   - [✓] Database error handling

2. **Single Category Tests**
   - [✓] Get existing category
   - [✓] Get non-existent returns null
   - [✓] Category data complete and correct

3. **List Retrieval Tests**
   - [✓] Get all returns 25 categories
   - [✓] Get by type: income returns 8
   - [✓] Get by type: expense returns 17
   - [✓] Consistent ordering

4. **Hierarchy Tests**
   - [✓] Get subcategories of parent with children
   - [✓] Get subcategories of parent without children (empty)
   - [✓] Only direct children returned (1 level)
   - [✓] Non-existent parent returns empty

5. **Validation Tests**
   - [✓] Valid category: Returns true
   - [✓] Invalid category: Returns false
   - [✓] Null/undefined input: Returns false

6. **Search Tests**
   - [✓] Exact name match: Found
   - [✓] Partial name match: Found
   - [✓] Case-insensitive: Works
   - [✓] No matches: Empty array
   - [✓] Empty query: All categories
   - [✓] Performance: < 50ms

---

## Integration Notes

### Used By

- `TransactionService` - Validates category references on create/update
- React components - Populate category dropdowns
- Application startup - Initialize categories on first load

### Dependencies

- DatabaseService - Low-level data access
- No external dependencies

### Data Files

**Predefined categories**: Defined in `data-model.md` section "Predefined Categories Data"

### Future Enhancements (Phase 2+)

- User-created custom categories
- Category editing/deletion
- Category grouping and organization
- Icon/color customization
- Category import/export
- Category usage analytics
- Archived/deprecated categories

---

## Sign-Off

**Contract Review**: [Date - TBD]
**Approved By**: [Name - TBD]
**Last Updated**: 2024-01-XX
