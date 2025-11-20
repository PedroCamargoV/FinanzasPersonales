import { DatabaseService } from '@/services/database'
import { Category, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types'
import { measureAsync } from '@/utils/performance'

/**
 * CategoryService - Manages transaction categories
 */
class CategoryService {
  /**
   * Initialize all predefined categories in the database
   */
  static async initializeCategories(): Promise<void> {
    try {
      await measureAsync('initialize-categories', async () => {
        // Check if categories already exist
        const existingCategories = await DatabaseService.getAll('categories')
        
        if (existingCategories.success && existingCategories.data && existingCategories.data.length > 0) {
          console.log(`${existingCategories.data.length} categories already initialized`)
          return
        }

        // Create all predefined categories
        const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]
        
        for (const category of allCategories) {
          await DatabaseService.create('categories', category as any)
        }

        console.log(`✅ Initialized ${allCategories.length} categories`)
      })
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
}

export default CategoryService
