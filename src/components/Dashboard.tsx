import { useEffect, useState } from 'react'
import { TransactionService, type TransactionStats } from '@/services'

interface DashboardProps {
  onAddTransaction: () => void
}

export function Dashboard({ onAddTransaction }: DashboardProps) {
  const [stats, setStats] = useState<TransactionStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await TransactionService.getStats()
        setStats(data)
      } catch (err) {
        console.error('Failed to load statistics:', err)
      } finally {
        setLoading(false)
      }
    }

    loadStats()

    // Reload stats every 5 seconds
    const interval = setInterval(loadStats, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Cargando datos...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen de tus finanzas</p>
        </div>
        <button
          onClick={onAddTransaction}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          + Nueva Transacción
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${stats.balance.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg text-xl">
              💰
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                +${stats.totalIncome.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-xl">
              📈
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Gastos Totales</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                -${stats.totalExpenses.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg text-xl">
              📉
            </div>
          </div>
        </div>

        {/* Transactions Count Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Transacciones</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.totalTransactions}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <div className="text-purple-600 text-sm font-bold">📊</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Desglose por Tipo</h2>
          <div className="space-y-4">
            {/* Ingresos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Ingresos</span>
                <span className="text-sm font-semibold text-green-600">
                  {stats.byType.ingreso.count} ({stats.byType.ingreso.average.toFixed(2)})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${stats.totalIncome > 0 ? (stats.byType.ingreso.total / stats.totalIncome) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Gastos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Gastos</span>
                <span className="text-sm font-semibold text-red-600">
                  {stats.byType.gasto.count} ({stats.byType.gasto.average.toFixed(2)})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${stats.totalExpenses > 0 ? (stats.byType.gasto.total / stats.totalExpenses) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm text-gray-600">Promedio por Transacción</span>
              <span className="font-semibold text-gray-900">
                ${stats.averageTransaction.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm text-gray-600">Promedio de Ingresos</span>
              <span className="font-semibold text-green-600">
                +${stats.byType.ingreso.average.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Promedio de Gastos</span>
              <span className="font-semibold text-red-600">
                -${stats.byType.gasto.average.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
