# Fase 1: Core Structure - Setup React Project and Implement CRUD

**Feature Number**: 001  
**Feature Branch**: `001-setup-react-project`  
**Created**: November 19, 2025  
**Status**: ✅ SPECIFICATION COMPLETE - Ready for Implementation  
**Owner**: Development Team  

## Overview

Implement the foundational React project structure with IndexedDB integration and complete CRUD operations for transactions (ingresos and gastos) with predefined category system. This is the core of the application that all other features depend on.

## Problem Statement

Without a solid core structure with working data persistence and CRUD operations, subsequent features cannot be built. This feature establishes the entire data layer and foundational services.

## User Scenarios & Testing

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Create and Persist Transaction (Priority: P1)

As a developer, I need the system to initialize React and IndexedDB so that user transactions can be stored and retrieved.

**Why this priority**: This is the foundation. Without this, nothing else works.

**Independent Test**: Can initialize app, create a transaction, reload browser, and confirm transaction still exists.

**Acceptance Scenarios**:

1. **Given** application loads for first time, **When** IndexedDB initializes, **Then** database is created with necessary object stores
2. **Given** user creates income transaction, **When** form is submitted, **Then** transaction is stored in IndexedDB with unique ID
3. **Given** transaction was stored, **When** browser is closed and reopened, **Then** transaction data persists and is retrievable

---

### User Story 2 - Transaction CRUD Operations (Priority: P1)

As a developer, I need full CRUD operations for transactions so that all basic data operations work reliably.

**Why this priority**: Core functionality. All features depend on this working.

**Independent Test**: Can create, read, update, and delete transactions without data loss.

**Acceptance Scenarios**:

1. **Given** new transaction is created, **When** querying by ID, **Then** returned data matches input exactly
2. **Given** transaction exists, **When** updating amount, **Then** changes persist and are reflected in queries
3. **Given** transaction exists, **When** deleting, **Then** transaction is no longer returned by queries
4. **Given** multiple transactions exist, **When** filtering by date range, **Then** only matching transactions returned

---

### User Story 3 - Predefined Categories (Priority: P1)

As a developer, I need predefined categories to load on first app launch so that users can immediately categorize transactions.

**Why this priority**: Users cannot use the app without categories to assign to transactions.

**Independent Test**: App loads, categories are initialized, and can be retrieved from database.

**Acceptance Scenarios**:

1. **Given** fresh app installation, **When** app loads, **Then** 8 income categories are created in database
2. **Given** fresh app installation, **When** app loads, **Then** 17 expense categories with subcategories are created
3. **Given** categories exist, **When** querying by type (ingreso/gasto), **Then** correct categories returned with properties intact
4. **Given** categories already exist, **When** app reloads, **Then** no duplicate categories created

---

### User Story 4 - Data Validation (Priority: P2)

As a developer, I need validation so that invalid data never reaches the database and causes inconsistencies.

**Why this priority**: Data integrity is critical. Better to prevent bad data than fix it later.

**Independent Test**: Attempt to save transactions with invalid data and verify rejection.

**Acceptance Scenarios**:

1. **Given** transaction form with missing title, **When** submitted, **Then** validation error returned and data not saved
2. **Given** transaction with negative amount, **When** submitted, **Then** validation error returned
3. **Given** transaction with invalid date, **When** submitted, **Then** validation error returned
4. **Given** transaction with amount > $1,000,000, **When** submitted, **Then** validation error returned

---

### User Story 5 - Error Handling (Priority: P2)

As a developer, I need graceful error handling so that database issues don't crash the app.

**Why this priority**: User experience. Errors should be handled gracefully with meaningful messages.

**Independent Test**: Simulate database errors and verify app remains stable.

**Acceptance Scenarios**:

1. **Given** IndexedDB quota exceeded, **When** attempting to save, **Then** meaningful error returned to user
2. **Given** corrupted database transaction, **When** querying, **Then** error caught and logged, not thrown to UI

---

### Edge Cases

- What happens when user creates transaction while offline? (Data saves locally immediately)
- What happens when IndexedDB quota is exceeded? (Graceful error, explain to user)
- What if categories already exist from previous installation? (Prevent duplicates)
- What if transaction data structure changes in future? (Use database versioning)

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

## Functional Requirements

### FR-001: React Application Setup

The system MUST initialize a React 18+ application with TypeScript and Tailwind CSS configured.

**Details**:
- React version: 18 or higher
- TypeScript strict mode enabled
- Tailwind CSS properly configured for styling
- Import aliases working (e.g., @/components)
- Development and production builds working

**Acceptance**:
- `npm start` runs without errors
- TypeScript compilation succeeds
- No type errors in console
- Tailwind classes recognized

---

### FR-002: IndexedDB Database Initialization

The system MUST initialize IndexedDB database on first load with proper schema and object stores.

**Details**:
- Database name: "finanzas-personales"
- Database version: 1 (upgradeable for future phases)
- Object stores required:
  - `transactions` (keyPath: "id", indexed by: date, category)
  - `categories` (keyPath: "id", indexed by: type)
  - `alerts` (keyPath: "id", indexed by: date)
- Automatic schema creation on first load
- Handle version upgrades gracefully

**Acceptance**:
- Database created with correct name
- All object stores initialized
- Indexes created for queryable fields
- Version 1 properly set

---

### FR-003: Transaction Create Operation

The system MUST allow creation of new transaction records in IndexedDB.

**Details**:
- Auto-generate unique ID (UUID v4)
- Require: title, amount, date, category, type (ingreso/gasto)
- Optional: description, tags, notes
- Auto-populate: createdAt, updatedAt timestamps
- Return: created transaction with ID
- Reject if validation fails

**Acceptance**:
- Transaction with all required fields saves successfully
- Unique ID generated and returned
- Timestamps auto-populated with current time
- Amount stored as number with 2 decimal places
- Transaction retrievable by ID immediately after creation

---

### FR-004: Transaction Read Operations

The system MUST retrieve transactions from IndexedDB with filtering capabilities.

**Details**:
- Get by ID: Return single transaction or null
- Get all: Return all transactions, sorted by date descending
- Filter by date range: Start date to end date
- Filter by category: All transactions in category
- Filter by type: Only ingresos or only gastos
- Chainable filters: (date range + category) simultaneously
- Limit results: Support pagination (offset, limit)

**Acceptance**:
- Get by ID returns exact transaction or null
- Get all returns sorted chronologically
- Date range filters work correctly
- Multiple filters can be applied together
- Results order consistent

---

### FR-005: Transaction Update and Delete Operations

The system MUST allow modification and removal of existing transaction records.

**Details**:
- Update: Modify any field except ID and createdAt
- Auto-update: updatedAt timestamp on changes
- Delete: Remove transaction completely (hard delete, no soft delete)
- Reject updates if validation fails
- Return error if transaction not found

**Acceptance**:
- Existing transaction updated successfully
- updatedAt reflects change time
- Delete removes transaction permanently
- Querying deleted transaction returns empty
- Invalid transaction ID rejected gracefully

---

### FR-006: Predefined Categories System

The system MUST initialize predefined categories on first load that cannot be deleted.

**Details**:
- Income categories (8 total):
  - Salary, Freelance, Investment, Gifts, Refund, Interest, Bonus, Other Income
- Expense categories (17 total) with subcategories:
  - Housing (Rent, Utilities, Maintenance)
  - Transportation (Gas, Maintenance, Public Transport, Parking)
  - Food (Groceries, Restaurants, Delivery)
  - Personal (Clothing, Hygiene, Health)
  - Entertainment (Movies, Games, Sports)
  - Utilities (Phone, Internet, Subscriptions)
  - Other (Misc expenses)
- Each category marked as system-defined (cannot edit/delete)
- Categories retrievable by type (ingreso/gasto)

**Acceptance**:
- All 8 income categories created on first load
- All 17 expense categories with subcategories created
- Duplicate prevention: Second load doesn't create duplicates
- Categories queryable by type
- System categories cannot be modified or deleted

---

## Non-Functional Requirements

### NFR-001: Performance

The system MUST meet these performance targets:

- Transaction CRUD operations: < 100ms (IndexedDB operations)
- Database query with filters: < 200ms (even with 1000+ transactions)
- App startup: < 2 seconds from load to ready state
- Category initialization: < 500ms
- No memory leaks on repeated operations

**Validation**: Measured using browser DevTools Performance tab

---

### NFR-002: Data Integrity

The system MUST guarantee data integrity:

- Zero data loss on browser reload
- Transaction atomicity: All-or-nothing (no partial saves)
- Referential integrity: Transactions reference valid categories
- Validation prevents invalid data from persisting
- Automatic backups: (Deferred to Phase 2)

**Validation**: Automated tests verify persistence after reload

---

### NFR-003: Code Quality

The system MUST maintain high code quality:

- TypeScript strict mode with no `any` types
- Minimum 80% test coverage for services
- ESLint configuration with no warnings
- All async operations properly handled
- Clear error messages for debugging

**Validation**: CI/CD checks TypeScript, runs tests, verifies coverage

---

### NFR-004: Maintainability

The system MUST be maintainable:

- Services decoupled from React components
- Clear separation: database layer, business logic, UI
- Comprehensive JSDoc comments on public APIs
- Consistent naming conventions
- Extensible for future features (phase 2+)

**Validation**: Code review checklist before merge

---

## Acceptance Tests

### Test Scenario 1: Fresh Install - Categories Initialize

**Setup**: Fresh browser (cleared IndexedDB and localStorage)

**Steps**:
1. Navigate to application
2. Check browser DevTools IndexedDB
3. Query categories object store

**Expected Result**:
- 25 categories total (8 income + 17 expense)
- All categories present with correct properties
- No duplicates
- System flag set to true for all predefined categories

**Pass Criteria**: All 25 categories exist with correct structure

---

### Test Scenario 2: Create and Persist Transaction

**Setup**: Fresh install completed

**Steps**:
1. Create new transaction: title="Salary", amount=3000, date=today, category="Salary", type="ingreso"
2. Confirm transaction returned with ID
3. Close browser completely (clear memory)
4. Reopen browser
5. Query transaction by ID

**Expected Result**:
- Transaction created with UUID
- Transaction retrieved successfully after reload
- All fields intact
- Timestamps accurate

**Pass Criteria**: Transaction persists across browser reload

---

### Test Scenario 3: Filter Transactions by Date Range

**Setup**: 10 transactions created across different dates (last 3 months)

**Steps**:
1. Query transactions for last 30 days
2. Query transactions for last 7 days
3. Query transactions for specific date only

**Expected Result**:
- Last 30 days returns correct count
- Last 7 days returns subset of 30-day query
- Specific date returns exact matches only
- Chronological order maintained

**Pass Criteria**: All date filters return correct results

---

### Test Scenario 4: Category Filtering

**Setup**: 15 transactions created (mix of ingresos and gastos, multiple categories)

**Steps**:
1. Filter: type = "ingreso"
2. Filter: type = "gasto"
3. Filter: category = "Groceries"
4. Filter: type = "gasto" AND category = "Groceries"

**Expected Result**:
- Type filters separate correctly
- Category filters accurate
- Combined filters work (AND logic)
- No cross-contamination between filters

**Pass Criteria**: All filtering combinations return correct subsets

---

### Test Scenario 5: Transaction Update with Timestamp Verification

**Setup**: Transaction exists from 1 hour ago

**Steps**:
1. Get transaction, note updatedAt timestamp
2. Wait 5 seconds
3. Update transaction (change amount)
4. Get updated transaction
5. Compare timestamps

**Expected Result**:
- createdAt unchanged
- updatedAt updated to current time
- Amount changed correctly
- Other fields unchanged

**Pass Criteria**: Timestamps update correctly on modification

---

### Test Scenario 6: Delete Transaction Verification

**Setup**: Transaction exists and is retrievable

**Steps**:
1. Get transaction by ID (confirm exists)
2. Delete transaction
3. Query deleted transaction by ID
4. Query all transactions (confirm total decreased by 1)

**Expected Result**:
- Delete operation succeeds
- Deleted transaction returns null on query
- Transaction count decreased
- Other transactions unaffected

**Pass Criteria**: Deleted transaction is completely removed

---

## Implementation Notes

### Architecture Pattern

Phase 1 follows a **service-oriented architecture**:

```
React Components (UI layer)
    ↓
Service Layer (DatabaseService, TransactionService, CategoryService)
    ↓
IndexedDB (Persistence layer)
```

Services are decoupled from React, enabling:
- Independent testing (no React dependencies)
- Reusability across future frameworks
- Clear separation of concerns

### Technology Choices

| Technology | Reason |
|-----------|--------|
| React 18+ | Modern, component-based, hooks support |
| TypeScript | Type safety, catches errors at compile time |
| IndexedDB | Client-side persistence, no backend needed |
| Tailwind CSS | Utility-first CSS, rapid UI development |
| date-fns | Lightweight date manipulation library |

### Database Schema Details

**transactions object store**:
```javascript
{
  id: "uuid-v4",                    // Primary key
  title: string,                    // Required
  amount: number,                   // 2 decimal places
  date: ISO8601 string,             // YYYY-MM-DD format
  category: string,                 // Foreign key to categories
  type: "ingreso" | "gasto",       // Required
  description?: string,             // Optional notes
  tags?: string[],                  // Optional tags
  createdAt: ISO8601 string,       // Auto-generated
  updatedAt: ISO8601 string,       // Auto-updated
}
```

**Indexes**: `date`, `category`, `type` (for fast filtering)

**categories object store**:
```javascript
{
  id: string,                       // Primary key
  name: string,                     // Display name
  type: "ingreso" | "gasto",       // Category type
  icon?: string,                    // Icon identifier
  color?: string,                   // Color hex code
  isSystemDefined: boolean,        // Cannot delete if true
  subcategories?: [{                // Optional for expense categories
    id: string,
    name: string,
  }],
  createdAt: ISO8601 string,
  updatedAt: ISO8601 string,
}
```

**Indexes**: `type`, `isSystemDefined`

### Validation Rules

| Field | Rules |
|-------|-------|
| title | Max 255 chars, non-empty |
| amount | > 0, <= 9,999,999.99, 2 decimal places |
| date | Valid ISO date, not in future |
| category | Must exist in categories store |
| type | Only "ingreso" or "gasto" |
| description | Max 1000 chars, optional |

### Error Handling Strategy

1. **Validation Errors**: Return early with descriptive message
2. **Database Errors**: Catch and log, return user-friendly message
3. **Transaction Errors**: All-or-nothing (use IDB transactions)
4. **Async Errors**: Promise catch blocks with proper typing

### Development Phases Within Phase 1

| Week | Focus |
|------|-------|
| 1 | React setup, TypeScript config, Tailwind CSS |
| 1.5 | DatabaseService implementation, IndexedDB schema |
| 2 | TransactionService CRUD, CategoryService initialization |
| 2.5 | Unit tests for all services (80%+ coverage) |
| 3 | Integration testing, performance optimization |
| 3 | Code review, documentation, merge to main |

### Known Constraints

- No backend API (all data client-side in Phase 1)
- No user authentication (single user per browser)
- No data sync across browsers
- No offline-first sync strategy (basic offline only)
- Categories immutable after Phase 1 start (can add more categories in Phase 2)

---

## Key Entities

### Transaction Entity

**Purpose**: Represents a single financial transaction (income or expense)

**Structure**:
- `id` (UUID): Unique identifier
- `title`: Transaction description (e.g., "Grocery shopping", "Salary payment")
- `amount`: Numeric value with 2 decimal precision
- `date`: Transaction date (ISO 8601)
- `category`: References category system
- `type`: "ingreso" (income) or "gasto" (expense)
- `createdAt`: Auto-generated timestamp
- `updatedAt`: Auto-updated timestamp

**Relationships**: Many-to-one with Category

### Category Entity

**Purpose**: Represents a predefined or custom transaction category

**Structure**:
- `id`: Unique identifier
- `name`: Category display name
- `type`: "ingreso" or "gasto"
- `isSystemDefined`: Boolean (predefined categories cannot be deleted)
- `subcategories`: Array of subcategory objects (for expenses)

**Predefined Categories**:
- 8 Income categories
- 17 Expense categories with 3-level hierarchy

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: All CRUD operations execute in < 100ms (measured with DevTools Performance)
- **SC-002**: App loads and displays categories in < 2 seconds on first load
- **SC-003**: 100% data persistence (transactions survive browser reload)
- **SC-004**: Zero validation errors in console after completing acceptance tests
- **SC-005**: All 6 acceptance test scenarios pass without manual intervention
- **SC-006**: Service layer achieves 80%+ test coverage (unit tests)
- **SC-007**: Zero TypeScript compilation errors in strict mode
- **SC-008**: All predefined categories initialize without duplicates on fresh install
- **SC-009**: Filtering by multiple criteria (date + category) returns correct subsets
- **SC-010**: Transaction timestamps (createdAt, updatedAt) function correctly

### Quality Gates

✅ **Gate 1**: All acceptance tests pass
✅ **Gate 2**: Test coverage >= 80% for services
✅ **Gate 3**: Performance benchmarks met (< 100ms for CRUD)
✅ **Gate 4**: Zero TypeScript errors
✅ **Gate 5**: Code review approval (architectural fit)
✅ **Gate 6**: Documentation complete (API docs, setup guide)

---

## References

- **PRD Analysis**: `../../../PRD-ANALYSIS.md` (Section 9: Phase 1 Implementation Plan)
- **Constitution**: `.specify/memory/constitution.md` (Project principles and stack)
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **IndexedDB MDN**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **React 18 Release Notes**: https://react.dev/blog/2022/03/29/react-v18

---

## Sign-Off

**Feature Lead**: [To be assigned]
**QA Lead**: [To be assigned]
**Status**: Ready for Planning Phase
**Last Updated**: 2024-01-XX
**Next Review**: When plan.md is complete
