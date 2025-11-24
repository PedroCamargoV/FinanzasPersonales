import { useState, useEffect, useRef } from 'react'
import { TransactionService, ValidationService, CategoryService } from '@/services'
import { parseLatinoAmount, formatLatinoAmount } from '@/utils'
import type { CreateTransactionDTO, Transaction, Category } from '@/types'
import { ChevronDown } from 'lucide-react'

interface TransactionFormProps {
  onSuccess: () => void
  onCancel: () => void
  editingTransaction?: Transaction | null
}

// Custom Category Dropdown Component
function CategoryDropdown({ 
  categories, 
  value, 
  onChange, 
  type 
}: { 
  categories: Category[]
  value: string
  onChange: (categoryId: string) => void
  type: 'ingreso' | 'gasto'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const parentCategories = categories
    .filter(cat => !cat.parentCategory && cat.isSystemDefined && cat.type === type)
    .sort((a, b) => a.name.localeCompare(b.name))
  
  const grouped: { [key: string]: Category[] } = {}
  categories
    .filter(cat => cat.parentCategory && cat.type === type)
    .forEach(cat => {
      const parentKey = cat.parentCategory
      if (parentKey && !grouped[parentKey]) {
        grouped[parentKey] = []
      }
      if (parentKey) {
        grouped[parentKey].push(cat)
      }
    })
  
  Object.keys(grouped).forEach(key => {
    grouped[key].sort((a, b) => a.name.localeCompare(b.name))
  })
  
  const customCategories = categories
    .filter(c => !c.isSystemDefined)
    .sort((a, b) => a.name.localeCompare(b.name))
  
  const selectedCategory = categories.find(c => c.id === value)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between bg-white"
      >
        <span className="flex items-center gap-2">
          {selectedCategory ? (
            <>
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedCategory.color || '#8B5CF6' }}
              />
              {selectedCategory.name}
            </>
          ) : (
            'Selecciona una categoría'
          )}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
          {/* System categories grouped by parent (for gastos) */}
          {type === 'gasto' && parentCategories.map(parentCat => {
            const hasSubcategories = grouped[parentCat.id] && grouped[parentCat.id].length > 0
            
            return (
              <div key={parentCat.id}>
                {/* If it has subcategories, show as group header */}
                {hasSubcategories ? (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 sticky top-0">
                      {parentCat.name}
                    </div>
                    {grouped[parentCat.id].map(subCat => (
                      <button
                        key={subCat.id}
                        type="button"
                        onClick={() => {
                          onChange(subCat.id)
                          setIsOpen(false)
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2 transition-colors"
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: subCat.color || '#8B5CF6' }}
                        />
                        {subCat.name}
                      </button>
                    ))}
                  </>
                ) : (
                  /* If it has no subcategories, show as a regular option */
                  <button
                    type="button"
                    onClick={() => {
                      onChange(parentCat.id)
                      setIsOpen(false)
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2 transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: parentCat.color || '#8B5CF6' }}
                    />
                    {parentCat.name}
                  </button>
                )}
              </div>
            )
          })}
          
          {/* System categories for ingresos (ungrouped) */}
          {type === 'ingreso' && parentCategories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onChange(cat.id)
                setIsOpen(false)
              }}
              className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color || '#8B5CF6' }}
              />
              {cat.name}
            </button>
          ))}
          
          {/* Custom categories */}
          {customCategories.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 sticky top-0">
                Personalizadas
              </div>
              {customCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onChange(cat.id)
                    setIsOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center gap-2 transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color || '#8B5CF6' }}
                  />
                  {cat.name}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function TransactionForm({ onSuccess, onCancel, editingTransaction }: TransactionFormProps) {
  const [formData, setFormData] = useState<CreateTransactionDTO>({
    title: editingTransaction?.title || '',
    amount: editingTransaction?.amount || 0,
    date: editingTransaction?.date || new Date().toISOString().split('T')[0],
    type: editingTransaction?.type || 'gasto',
    category: editingTransaction?.category || '',
    description: editingTransaction?.description || '',
  })

  // State for amount display (formatted as Latin American currency)
  const [amountDisplay, setAmountDisplay] = useState<string>(
    editingTransaction ? formatLatinoAmount(editingTransaction.amount) : ''
  )

  const [categories, setCategories] = useState<Category[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Add small delay to ensure categories are initialized in DB
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Get categories of the selected type PLUS custom categories
        const allCategories = await CategoryService.getAllCategories()
        const filteredCategories = allCategories.filter(
          cat => cat.type === formData.type || !cat.isSystemDefined
        )
        setCategories(filteredCategories)
        
        if (filteredCategories.length === 0) {
          console.warn(`No categories found for type: ${formData.type}`)
        }
      } catch (err) {
        console.error('Failed to load categories:', err)
        setCategories([])
      }
    }

    loadCategories()
  }, [formData.type])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'amount') {
      // Update display value and parse the actual amount
      setAmountDisplay(value)
      const parsedAmount = parseLatinoAmount(value)
      setFormData(prev => ({
        ...prev,
        amount: parsedAmount,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)

    try {
      // Validate
      if (editingTransaction) {
        const validation = ValidationService.validateTransactionUpdate(formData)
        if (!validation.isValid) {
          setErrors(validation.errors)
          setLoading(false)
          return
        }
      } else {
        const validation = ValidationService.validateTransaction(formData)
        if (!validation.isValid) {
          setErrors(validation.errors)
          setLoading(false)
          return
        }
      }

      // Additional validation: Description is required for "Otros" category
      if (formData.category === 'other-expense' && !formData.description?.trim()) {
        setErrors(['La descripción es obligatoria cuando seleccionas la categoría "Otros"'])
        setLoading(false)
        return
      }

      // Save
      if (editingTransaction) {
        await TransactionService.updateTransaction(editingTransaction.id, formData)
      } else {
        await TransactionService.createTransaction(formData)
      }

      onSuccess()
    } catch (err) {
      setErrors([err instanceof Error ? err.message : 'Error al guardar la transacción'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}
      </h2>

      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold mb-2">Errores:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-red-600 text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Compra de comida"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
          <input
            type="text"
            name="amount"
            value={amountDisplay}
            onChange={handleChange}
            placeholder="Ej: 1.500,50"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Formato: 1.500,50 (miles, decimales)</p>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <CategoryDropdown
            categories={categories}
            value={formData.category}
            onChange={(categoryId) => setFormData(prev => ({ ...prev, category: categoryId }))}
            type={formData.type as 'ingreso' | 'gasto'}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción {formData.category === 'other-expense' && <span className="text-red-500">*</span>}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={formData.category === 'other-expense' ? 'Descripción requerida para la categoría "Otros"' : 'Notas adicionales...'}
            rows={3}
            required={formData.category === 'other-expense'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.category === 'other-expense' ? 'Requerida para la categoría "Otros"' : 'Opcional'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
          >
            {loading ? 'Guardando...' : editingTransaction ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  )
}
