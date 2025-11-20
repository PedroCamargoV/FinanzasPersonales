import { useState, useEffect } from 'react'
import { TransactionService, ValidationService, CategoryService } from '@/services'
import type { CreateTransactionDTO, Transaction } from '@/types'

interface TransactionFormProps {
  onSuccess: () => void
  onCancel: () => void
  editingTransaction?: Transaction | null
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

  const [categories, setCategories] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await CategoryService.getCategoriesByType(formData.type)
        setCategories(cats)
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }

    loadCategories()
  }, [formData.type])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }))
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
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Notas adicionales..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
