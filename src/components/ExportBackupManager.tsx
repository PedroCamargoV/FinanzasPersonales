import { DatabaseService, TransactionService } from '@/services'
import { useState } from 'react'

export function ExportBackupManager() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExportCSV = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const transactions = await TransactionService.getAllTransactions()

      // Create CSV header
      const headers = [
        'ID',
        'Título',
        'Monto',
        'Tipo',
        'Categoría',
        'Descripción',
        'Fecha',
        'Creado',
      ]

      // Create CSV rows
      const rows = transactions.map(tx => [
        tx.id,
        `"${tx.title}"`,
        tx.amount,
        tx.type,
        tx.category,
        `"${tx.description || ''}"`,
        new Date(tx.date).toLocaleDateString('es-ES'),
        new Date(tx.createdAt).toLocaleString('es-ES'),
      ])

      // Combine headers and rows
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n')

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `finanzas-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setSuccess(`Exportado ${transactions.length} transacciones a CSV`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error exporting to CSV')
    } finally {
      setLoading(false)
    }
  }

  const handleExportJSON = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const transactions = await TransactionService.getAllTransactions()

      const backup = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        transactionCount: transactions.length,
        transactions,
      }

      const json = JSON.stringify(backup, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `finanzas-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setSuccess(`Backup creado con ${transactions.length} transacciones`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating backup')
    } finally {
      setLoading(false)
    }
  }

  const handleRestoreJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const file = event.target.files?.[0]
      if (!file) return

      const text = await file.text()
      const backup = JSON.parse(text)

      if (!backup.transactions || !Array.isArray(backup.transactions)) {
        throw new Error('Formato de archivo de backup inválido')
      }

      // Import transactions
      for (const tx of backup.transactions) {
        await (TransactionService as any).createTransaction({
          title: tx.title,
          amount: tx.amount,
          type: tx.type,
          category: tx.category,
          date: new Date(tx.date),
          description: tx.description
        })
      }

      setSuccess(`Restauradas ${backup.transactions.length} transacciones`)
      event.target.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error restoring backup')
      event.target.value = ''
    } finally {
      setLoading(false)
    }
  }

  const handleClearAll = async () => {
    if (
      !confirm(
        '⚠️ ADVERTENCIA: Esto eliminará TODAS las transacciones. ¿Estás seguro? Esta acción no se puede deshacer.'
      )
    ) {
      return
    }

    if (!confirm('Confirma que deseas eliminar todos los datos? Haz clic en OK para confirmar.')) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      await DatabaseService.clear('transactions')
      setSuccess('Todas las transacciones han sido eliminadas')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error clearing data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">💾 Exportar & Backup</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ✕
        </button>
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

        {/* Export Section */}
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">📥 Exportar Datos</h3>

          <div className="space-y-3">
            {/* CSV Export */}
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-2">Exportar a CSV</h4>
              <p className="text-sm text-gray-600 mb-3">
                Descarga tus transacciones en formato CSV para usar en Excel o Sheets
              </p>
              <button
                onClick={handleExportCSV}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Procesando...' : '📊 Descargar CSV'}
              </button>
            </div>

            {/* JSON Backup */}
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-2">Crear Backup JSON</h4>
              <p className="text-sm text-gray-600 mb-3">
                Crea un backup completo en JSON que puedas restaurar después
              </p>
              <button
                onClick={handleExportJSON}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Procesando...' : '💾 Descargar Backup JSON'}
              </button>
            </div>
          </div>
        </div>

        {/* Restore Section */}
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4">📤 Restaurar desde Backup</h3>

          <div className="bg-white p-4 rounded-lg border border-green-100">
            <h4 className="font-semibold text-gray-900 mb-2">Restaurar archivo JSON</h4>
            <p className="text-sm text-gray-600 mb-3">
              Selecciona un archivo JSON de backup para restaurar transacciones
            </p>
            <label className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer inline-block text-center disabled:opacity-50">
              {loading ? 'Procesando...' : '📁 Seleccionar archivo'}
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreJSON}
                disabled={loading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">⚠️ Las transacciones restauradas se añadirán a las existentes</p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Zona de Peligro</h3>

          <div className="bg-white p-4 rounded-lg border border-red-100">
            <h4 className="font-semibold text-gray-900 mb-2">Eliminar Todos los Datos</h4>
            <p className="text-sm text-gray-600 mb-3">
              Esta acción eliminará TODAS las transacciones de forma permanente. No se puede deshacer.
            </p>
            <button
              onClick={handleClearAll}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Procesando...' : '🗑️ Eliminar Todos los Datos'}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">ℹ️ Información útil</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>CSV:</strong> Ideal para importar a Excel, Google Sheets o análisis</li>
            <li>• <strong>JSON:</strong> Formato completo que preserva toda la información</li>
            <li>• <strong>Restore:</strong> Solo soporta archivos JSON creados por esta app</li>
            <li>• <strong>Backup:</strong> Realiza copias de seguridad regularmente</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
