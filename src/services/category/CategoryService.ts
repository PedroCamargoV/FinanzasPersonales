import { DatabaseService } from '@/services/database'
import { Category, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types'

/**
 * CategoryService - Manages transaction categories
 */
class CategoryService {
  /**
   * Initialize all predefined categories in the database
   */
  static async initializeCategories(): Promise<void> {
    try {
      // Get all existing categories
      let existingCategories: any[] = []
      try {
        const result = await DatabaseService.getAll('categories')
        existingCategories = result.data || []
      } catch (err) {
        // If getAll fails, treat as empty list and proceed with initialization
        console.warn('Could not fetch existing categories, will reinitialize:', err)
        existingCategories = []
      }

      // If we have categories, we're done
      if (existingCategories.length > 0) {
        console.log(`✅ ${existingCategories.length} categories already initialized`)
        return
      }

      console.log('🔄 Starting category initialization...')

      // Create all predefined categories
      const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
      let successCount = 0
      let failedCount = 0
      const failedCategories = []
      
      for (const category of allCategories) {
        try {
          await DatabaseService.create('categories', category as any)
          successCount++
          console.log(`✅ Created category: ${category.id}`)
        } catch (err) {
          failedCount++
          failedCategories.push(category.id)
          console.error(`❌ Failed to create category ${category.id}:`, err instanceof Error ? err.message : err)
        }
      }

      console.log(`📊 Category initialization complete: ${successCount}/${allCategories.length} successful`)
      
      if (failedCount > 0) {
        console.warn(`⚠️ Failed categories: ${failedCategories.join(', ')}`)
      }
      
      if (successCount === 0) {
        throw new Error(`Failed to initialize any categories. Details: ${failedCategories.join(', ')}`)
      }
    } catch (error) {
      throw new Error(`Failed to initialize categories: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get all categories
   */
  static async getAllCategories(): Promise<Category[]> {
    try {
      const result = await DatabaseService.getAll('categories')
      return (result.data || []) as Category[]
    } catch (error) {
      throw new Error(`Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get categories by type (ingreso or gasto)
   */
  static async getCategoriesByType(type: 'ingreso' | 'gasto'): Promise<Category[]> {
    try {
      const allCategories = await CategoryService.getAllCategories()
      return allCategories.filter((cat: any) => cat.type === type)
    } catch (error) {
      throw new Error(`Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Create a custom category
   */
  static async createCategory(name: string, type: 'ingreso' | 'gasto'): Promise<Category> {
    try {
      const now = new Date().toISOString()
      const newCategory: any = {
        id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        type,
        isSystemDefined: false,
        createdAt: now,
        updatedAt: now,
      }

      const result = await DatabaseService.create('categories', newCategory)
      if (!result.success) {
        throw new Error('Failed to create category in database')
      }

      return newCategory
    } catch (error) {
      throw new Error(`Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Delete a custom category
   */
  static async deleteCategory(categoryId: string): Promise<void> {
    try {
      const category = await CategoryService.getCategory(categoryId)
      if (!category) {
        throw new Error('Category not found')
      }

      if (category.isSystemDefined) {
        throw new Error('Cannot delete predefined categories')
      }

      const result = await DatabaseService.delete('categories', categoryId)
      if (!result.success) {
        throw new Error('Failed to delete category from database')
      }
    } catch (error) {
      throw new Error(`Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get a single category by ID
   */
  static async getCategory(id: string): Promise<Category | null> {
    try {
      const result = await DatabaseService.getById('categories', id)
      return (result.data as Category) || null
    } catch (error) {
      throw new Error(`Failed to get category: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export default CategoryService
