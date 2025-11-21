import { useEffect, useState } from 'react'
import { RecurringTransactionService } from '@/services'
import type { RecurringTransaction, RecurrenceFrequency } from '@/types'

interface RecurringTransactionManagerProps {
  onClose: () => void
}

export function RecurringTransactionManager({ onClose }: RecurringTransactionManagerProps) {
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'gasto' as 'ingreso' | 'gasto',
    category: '',
    frequency: 'monthly' as RecurrenceFrequency,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
  })

  const frequencies: { value: RecurrenceFrequency; label: string }[] = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'biweekly', label: 'Quincenal' },
    { value: 'monthly', label: 'Mensual' },
    { value: 'yearly', label: 'Anual' },
  ]

  const categories = [
    'Salario',
    'Freelance',
    'Inversiones',
    'Alquiler',
    'Servicios',
    'Comida',
    'Transporte',
    'Entretenimiento',
    'Salud',
    'Educación',
    'Otro',
  ]

  const loadRecurring = async () => {
    try {
      setLoading(true)
      const data = await RecurringTransactionService.getAllRecurring()
      setRecurring(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading recurring transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecurring()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      if (!formData.title.trim()) {
        setError('El título es requerido')
        return
      }

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setError('El monto debe ser mayor a 0')
        return
      }

      if (!formData.category.trim()) {
        setError('La categoría es requerida')
        return
      }

      const startDate = new Date(formData.startDate)
      const endDate = formData.endDate ? new Date(formData.endDate) : undefined

      if (endDate && endDate < startDate) {
        setError('La fecha de fin debe ser posterior a la de inicio')
        return
      }

      if (editingId) {
        // Update existing
        const rec = recurring.find(r => r.id === editingId)
        if (rec) {
          await RecurringTransactionService.updateRecurring(editingId, {
            title: formData.title,
            amount: parseFloat(formData.amount),
            type: formData.type,
            category: formData.category,
            frequency: formData.frequency,
            startDate,
            endDate,
            description: formData.description,
          })
          setSuccess('Transacción recurrente actualizada exitosamente')
        }
      } else {
        // Create new
        await RecurringTransactionService.createRecurring(
          formData.title,
          parseFloat(formData.amount),
          formData.type,
          formData.category,
          formData.frequency,
          startDate,
          endDate,
          formData.description
        )
        setSuccess('Transacción recurrente creada exitosamente')
      }

      setFormData({
        title: '',
        amount: '',
        type: 'gasto',
        category: '',
        frequency: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        description: '',
      })
      setEditingId(null)
      setShowForm(false)
      await loadRecurring()
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : editingId ? 'Error updating recurring transaction' : 'Error creating recurring transaction')
    }
  }

  const handleEdit = (rec: RecurringTransaction) => {
    setEditingId(rec.id)
    setFormData({
      title: rec.title,
      amount: rec.amount.toString(),
      type: rec.type,
      category: rec.category,
      frequency: rec.frequency,
      startDate: new Date(rec.startDate).toISOString().split('T')[0],
      endDate: rec.endDate ? new Date(rec.endDate).toISOString().split('T')[0] : '',
      description: rec.description || '',
    })
    setShowForm(true)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({
      title: '',
      amount: '',
      type: 'gasto',
      category: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      description: '',
    })
    setShowForm(false)
  }

  const handleToggle = async (id: string) => {
    try {
      // Find and update the transaction in local state
      const updatedRecurring = recurring.map(rec =>
        rec.id === id ? { ...rec, isActive: !rec.isActive } : rec
      )
      setRecurring(updatedRecurring)
      setSuccess('Estado actualizado')
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      
      // Update in database
      await RecurringTransactionService.toggleRecurring(id)
    } catch (err) {
      // Reload on error to revert the optimistic update
      await loadRecurring()
      setError(err instanceof Error ? err.message : 'Error toggling recurring transaction')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Seguro de que deseas eliminar esta transacción recurrente?')) {
      try {
        await RecurringTransactionService.deleteRecurring(id)
        await loadRecurring()
        setSuccess('Transacción recurrente eliminada')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error deleting recurring transaction')
      }
    }
  }

  const getFrequencyLabel = (freq: RecurrenceFrequency): string => {
    return frequencies.find(f => f.value === freq)?.label || freq
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Cargando transacciones recurrentes...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900">⏱️ Transacciones Recurrentes</h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
              {success}
            </div>
          )}

          {/* New Button */}
          <button
            onClick={() => editingId ? cancelEdit() : setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {editingId ? '✕ Cancelar Edición' : showForm ? '✕ Cancelar' : '+ Nueva Transacción Recurrente'}
          </button>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Salario mensual"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as 'ingreso' | 'gasto' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frecuencia *
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value as RecurrenceFrequency })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {frequencies.map(freq => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Notas adicionales"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {editingId ? 'Actualizar Transacción Recurrente' : 'Crear Transacción Recurrente'}
              </button>
            </form>
          )}

          {/* Recurring Transactions List */}
          {recurring.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Transacciones Configuradas</h3>
              {recurring.map(rec => (
                <div
                  key={rec.id}
                  className={`p-4 rounded-lg border-2 ${
                    rec.isActive
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{rec.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          rec.type === 'ingreso'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {rec.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                          {getFrequencyLabel(rec.frequency)}
                        </span>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                          rec.isActive
                            ? 'bg-green-200 text-green-900 ring-2 ring-green-400'
                            : 'bg-red-200 text-red-900 ring-2 ring-red-400'
                        }`}>
                          {rec.isActive ? '✓ Activo' : '⏸ Inactivo'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">Monto:</span> ${rec.amount.toLocaleString('es-ES', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <div>
                          <span className="font-medium">Categoría:</span> {rec.category}
                        </div>
                        <div>
                          <span className="font-medium">Inicio:</span> {new Date(rec.startDate).toLocaleDateString('es-ES')}
                        </div>
                        <div>
                          <span className="font-medium">Fin:</span> {rec.endDate ? new Date(rec.endDate).toLocaleDateString('es-ES') : 'Indefinido'}
                        </div>
                      </div>

                      {rec.description && (
                        <p className="text-sm text-gray-600 italic">{rec.description}</p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4 flex-wrap justify-end">
                      <button
                        onClick={() => handleEdit(rec)}
                        className="px-3 py-1 text-sm font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        ✎ Editar
                      </button>
                      <button
                        onClick={() => handleToggle(rec.id)}
                        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                          rec.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {rec.isActive ? 'Pausar' : 'Reactivar'}
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="px-3 py-1 text-sm font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No hay transacciones recurrentes configuradas.</p>
              <p className="text-sm">Crea una nueva para empezar a automatizar tus transacciones.</p>
            </div>
          )}
        </div>
    </div>
  )
}
