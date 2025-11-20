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
      // Check if categories already exist
      const existingCategories = await DatabaseService.getAll('categories')
      
      if (existingCategories.success && existingCategories.data && existingCategories.data.length > 0) {
        console.log(`✅ ${existingCategories.data.length} categories already initialized`)
        return
      }

      // Create all predefined categories
      const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
      
      for (const category of allCategories) {
        await DatabaseService.create('categories', category as any)
      }

      console.log(`✅ Initialized ${allCategories.length} categories`)
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
