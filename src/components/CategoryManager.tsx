import { useEffect, useState } from 'react'
import { CategoryService } from '@/services'
import type { Category } from '@/types'

interface NewCategoryForm {
  name: string
  color: string
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [customCategories, setCustomCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<NewCategoryForm>({
    name: '',
    color: '#3B82F6',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const PRESET_COLORS = [
    '#EF4444', // red
    '#F97316', // orange
    '#EAB308', // yellow
    '#22C55E', // green
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
  ]

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const all = await CategoryService.getAllCategories()
        const predefined = all.filter((c: any) => c.isSystemDefined)
        const custom = all.filter((c: any) => !c.isSystemDefined)
        setCategories(predefined)
        setCustomCategories(custom)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading categories')
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!formData.name.trim()) {
      setError('El nombre de la categoría es requerido')
      return
    }

    try {
      await CategoryService.createCategory(
        formData.name,
        'gasto',
        formData.color
      )
      setSuccess(`Categoría "${formData.name}" creada exitosamente`)
      setFormData({ name: '', color: '#3B82F6' })
      setShowForm(false)

      // Reload categories
      const all = await CategoryService.getAllCategories()
      const custom = all.filter((c: any) => !c.isSystemDefined)
      setCustomCategories(custom)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating category')
    }
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`¿Eliminar la categoría "${categoryName}"?`)) {
      return
    }

    try {
      await CategoryService.deleteCategory(categoryId)
      setSuccess(`Categoría "${categoryName}" eliminada`)
      setCustomCategories(prev => prev.filter(c => c.id !== categoryId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting category')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-center">Cargando categorías...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">📁 Gestionar Categorías</h2>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Predefined Categories - Two Column Layout */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔒 Categorías Predefinidas (No editables)
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ingresos Column */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h4 className="font-semibold text-green-700 mb-4 pb-2 border-b-2 border-green-200">
                  💰 Ingresos
                </h4>
                <div className="space-y-2">
                  {categories
                    .filter(c => c.type === 'ingreso')
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(cat => (
                      <div key={cat.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color || '#4CAF50' }}
                        ></div>
                        <span className="text-sm text-gray-700">{cat.name}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Gastos Column */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h4 className="font-semibold text-red-700 mb-4 pb-2 border-b-2 border-red-200">
                  💸 Gastos
                </h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {categories
                    .filter(c => c.type === 'gasto' && !c.parentCategory)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(parentCat => {
                      const subcategories = categories
                        .filter(c => c.parentCategory === parentCat.id)
                        .sort((a, b) => a.name.localeCompare(b.name))

                      return (
                        <div key={parentCat.id} className="space-y-1">
                          {/* Parent Category */}
                          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium">
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: parentCat.color || '#FF6B6B' }}
                            ></div>
                            <span className="text-sm text-gray-800">{parentCat.name}</span>
                          </div>
                          
                          {/* Subcategories */}
                          {subcategories.length > 0 && (
                            <div className="pl-6 space-y-1">
                              {subcategories.map(subCat => (
                                <div key={subCat.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                                  <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: subCat.color || '#FF6B6B' }}
                                  ></div>
                                  <span className="text-xs text-gray-600">{subCat.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Custom Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ✨ Tus Categorías Personalizadas
            </h3>
            {customCategories.length > 0 ? (
              <div className="space-y-2">
                {customCategories.map(cat => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: '#8B5CF6' }}
                      ></div>
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-medium"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No tienes categorías personalizadas aún. ¡Crea una!
              </p>
            )}
          </div>

          {/* Create New Category Form */}
          <div className="border-t border-gray-200 pt-6">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Nueva Categoría Personalizada
              </button>
            ) : (
              <form onSubmit={handleCreateCategory} className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Categoría
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ej: Hobbies"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setFormData(prev => ({ ...prev, color }))
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color
                            ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    ✓ Crear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({ name: '', color: '#3B82F6' })
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    ✕ Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
    </div>
  )
}
