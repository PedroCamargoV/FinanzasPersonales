import { DatabaseService } from '@/services/database'
import { Category, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types'
import { measureAsync } from '@/utils/performance'

/**
 * CategoryService - Manages transaction categories
 * 
 * Provides methods for:
 * - Initializing predefined categories
 * - Retrieving categories by type or filter
 * - Validating category existence
 * - Searching categories
 */
class CategoryService {
  private static instance: CategoryService

  private constructor() {}

  /**
   * Get singleton instance of CategoryService
   */
  static getInstance(): CategoryService {
    if (!this.instance) {
      this.instance = new CategoryService()
    }
    return this.instance
  }

  /**
   * Initialize all predefined categories in the database
   * 
   * Loads 8 income categories and 17 expense categories
   * Only initializes once per session to avoid duplicates
   * 
   * @returns Promise<void>
   * @throws Error if initialization fails
   * 
   * @example
   * await CategoryService.initializeCategories()
   */
  async initializeCategories(): Promise<void> {
    try {
      await measureAsync('initialize-categories', async () => {
        // Check if categories already exist
        const existingCategories = await DatabaseService.getAll('categories')
        
        if (existingCategories.success && existingCategories.data && existingCategories.data.length > 0) {
          console.log(`${existingCategories.data.length} categories already exist in database`)
          return
        }

        // Create all predefined categories
        const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
        
        for (const category of allCategories) {
          const createResult = await DatabaseService.create('categories', category as any)
          if (!createResult.success) {
            console.warn(`Failed to create category: ${category.name}`)
          }
        }

        console.log(`✅ Initialized ${allCategories.length} categories`)
      })
    } catch (error) {
      throw new Error(`Failed to initialize categories: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get a single category by ID
   * 
   * @param id - Category ID (UUID)
   * @returns Promise<Category | null> - Category object or null if not found
   * @throws Error if retrieval fails
   * 
   * @example
   * const category = await CategoryService.getCategory('cat-123')
   */
  async getCategory(id: string): Promise<Category | null> {
    try {
      const result = await measureAsync(
        'get-category',
        () => DatabaseService.getById('categories', id)
      )

      if (result.success && result.data) {
        return result.data as Category
      }
      return null
    } catch (error) {
      throw new Error(`Failed to get category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get all categories
   * 
   * @returns Promise<Category[]> - Array of all categories
   * @throws Error if retrieval fails
   * 
   * @example
   * const allCategories = await CategoryService.getAllCategories()
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const result = await measureAsync(
        'get-all-categories',
        () => DatabaseService.getAll('categories')
      )

      if (result.success && result.data) {
        return result.data as Category[]
      }
      return []
    } catch (error) {
      throw new Error(`Failed to get all categories: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get categories filtered by type (ingreso or gasto)
   * 
   * @param type - Transaction type: 'ingreso' or 'gasto'
   * @returns Promise<Category[]> - Filtered categories
   * @throws Error if query fails
   * 
   * @example
   * const expenses = await CategoryService.getCategoriesByType('gasto')
   */
  async getCategoriesByType(type: 'ingreso' | 'gasto'): Promise<Category[]> {
    try {
      const result = await measureAsync(
        `get-categories-by-type-${type}`,
        () => DatabaseService.query('categories', 'type', type)
      )

      if (result.success && result.data) {
        return result.data as Category[]
      }
      return []
    } catch (error) {
      throw new Error(`Failed to get categories by type: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get subcategories for a parent category
   * 
   * @param parentCategoryId - Parent category ID
   * @returns Promise<Category[]> - Array of subcategories
   * @throws Error if query fails
   * 
   * @example
   * const subcats = await CategoryService.getSubcategories('housing')
   */
  async getSubcategories(parentCategoryId: string): Promise<Category[]> {
    try {
      const result = await measureAsync(
        'get-subcategories',
        () => DatabaseService.query('categories', 'parentCategory', parentCategoryId)
      )

      if (result.success && result.data) {
        return result.data as Category[]
      }
      return []
    } catch (error) {
      throw new Error(`Failed to get subcategories: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Validate if a category exists by ID
   * 
   * @param categoryId - Category ID to validate
   * @returns Promise<boolean> - True if category exists
   * 
   * @example
   * const exists = await CategoryService.validateCategoryExists('cat-123')
   */
  async validateCategoryExists(categoryId: string): Promise<boolean> {
    try {
      const category = await this.getCategory(categoryId)
      return category !== null
    } catch (error) {
      console.error('Error validating category existence:', error)
      return false
    }
  }

  /**
   * Search categories by name (case-insensitive partial match)
   * 
   * @param query - Search term
   * @returns Promise<Category[]> - Matching categories
   * 
   * @example
   * const results = await CategoryService.searchCategories('hous')
   */
  async searchCategories(query: string): Promise<Category[]> {
    try {
      const allCategories = await this.getAllCategories()
      const lowerQuery = query.toLowerCase()
      
      return allCategories.filter(cat => 
        cat.name.toLowerCase().includes(lowerQuery)
      )
    } catch (error) {
      console.error('Error searching categories:', error)
      return []
    }
  }

  /**
   * Create a custom category
   * 
   * @param category - Category data (without ID and timestamps)
   * @returns Promise<string> - Created category ID
   * @throws Error if creation fails
   * 
   * @example
   * const categoryId = await CategoryService.createCategory({
   *   name: 'My Custom Category',
   *   color: '#FF5733',
   *   type: 'gasto',
   *   isSystemDefined: false
   * })
   */
  async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const result = await DatabaseService.create('categories', {
        ...category,
        isSystemDefined: false
      } as any)

      if (result.success && result.data) {
        return result.data
      }

      throw new Error('Failed to create category')
    } catch (error) {
      throw new Error(`Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Update an existing category
   * 
   * @param categoryId - ID of category to update
   * @param updates - Partial category data to update
   * @returns Promise<void>
   * @throws Error if update fails or category is system-defined
   * 
   * @example
   * await CategoryService.updateCategory('cat-123', {
   *   name: 'Updated Name',
   *   color: '#00FF00'
   * })
   */
  async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    try {
      // Check if category exists and is not system-defined
      const category = await this.getCategory(categoryId)
      
      if (!category) {
        throw new Error('Category not found')
      }

      if (category.isSystemDefined) {
        throw new Error('Cannot modify predefined categories')
      }

      await DatabaseService.update('categories', categoryId, updates as any)
    } catch (error) {
      throw new Error(`Failed to update category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Delete a custom category
   * 
   * @param categoryId - ID of category to delete
   * @returns Promise<void>
   * @throws Error if deletion fails or category is system-defined
   * 
   * @example
   * await CategoryService.deleteCategory('cat-123')
   */
  async deleteCategory(categoryId: string): Promise<void> {
    try {
      // Check if category exists and is not system-defined
      const category = await this.getCategory(categoryId)
      
      if (!category) {
        throw new Error('Category not found')
      }

      if (category.isSystemDefined) {
        throw new Error('Cannot delete predefined categories')
      }

      await DatabaseService.delete('categories', categoryId)
    } catch (error) {
      throw new Error(`Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Export singleton instance
export default CategoryService.getInstance()
