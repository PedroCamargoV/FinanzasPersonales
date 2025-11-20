import { useEffect, useState } from 'react'
import { TransactionService } from '@/services'
import type { Transaction } from '@/types'

interface AnalyticsProps {
  onClose: () => void
}

interface CategorySpending {
  category: string
  amount: number
  percentage: number
}

export function Analytics({ onClose }: AnalyticsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [loading, setLoading] = useState(true)

  const COLORS = [
    '#EF4444',
    '#F97316',
    '#EAB308',
    '#22C55E',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
  ]

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true)
        const allTransactions = await TransactionService.getAllTransactions()
        setTransactions(allTransactions)

        // Calculate category spending
        const categoryMap = new Map<string, number>()
        let income = 0
        let expenses = 0

        allTransactions.forEach(tx => {
          if (tx.type === 'ingreso') {
            income += tx.amount
          } else {
            expenses += tx.amount
            const current = categoryMap.get(tx.category) || 0
            categoryMap.set(tx.category, current + tx.amount)
          }
        })

        setTotalIncome(income)
        setTotalExpenses(expenses)

        // Convert to array and sort
        const spending: CategorySpending[] = Array.from(categoryMap.entries())
          .map(([category, amount]) => ({
            category,
            amount,
            percentage: expenses > 0 ? (amount / expenses) * 100 : 0,
          }))
          .sort((a, b) => b.amount - a.amount)

        setCategorySpending(spending)
      } catch (err) {
        console.error('Error loading analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  const getPieChartPath = (): string[] => {
    if (categorySpending.length === 0) return []

    let currentAngle = -90
    let paths: string[] = []

    categorySpending.forEach((item) => {
      const sliceAngle = (item.percentage / 100) * 360
      const startAngle = currentAngle
      const endAngle = currentAngle + sliceAngle

      // Convert to radians
      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180

      // Calculate arc endpoints
      const x1 = 100 + 80 * Math.cos(startRad)
      const y1 = 100 + 80 * Math.sin(startRad)
      const x2 = 100 + 80 * Math.cos(endRad)
      const y2 = 100 + 80 * Math.sin(endRad)

      // Large arc flag
      const largeArc = sliceAngle > 180 ? 1 : 0

      // Create path
      const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`
      paths.push(path)

      currentAngle = endAngle
    })

    return paths
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Cargando análisis...</p>
      </div>
    )
  }

  const paths = getPieChartPath()

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">📊 Análisis de Gastos</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-700 text-sm font-medium">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${totalIncome.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-700 text-sm font-medium">Gastos Totales</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ${totalExpenses.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div
              className={`${
                totalIncome - totalExpenses >= 0 ? 'bg-blue-50' : 'bg-yellow-50'
              } p-4 rounded-lg ${
                totalIncome - totalExpenses >= 0
                  ? 'border-blue-200'
                  : 'border-yellow-200'
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  totalIncome - totalExpenses >= 0
                    ? 'text-blue-700'
                    : 'text-yellow-700'
                }`}
              >
                Balance
              </p>
              <p
                className={`text-2xl font-bold mt-2 ${
                  totalIncome - totalExpenses >= 0
                    ? 'text-blue-600'
                    : 'text-yellow-600'
                }`}
              >
                ${(totalIncome - totalExpenses).toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          {categorySpending.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Gastos por Categoría
                </h3>
                <svg viewBox="0 0 200 200" className="w-full h-64">
                  {paths.map((pathStr: string, idx: number) => (
                    <path
                      key={idx}
                      d={pathStr}
                      fill={COLORS[idx % COLORS.length]}
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              </div>

              {/* Category Breakdown */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Desglose por Categoría
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {categorySpending.map((item, idx) => (
                    <div key={item.category} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: COLORS[idx % COLORS.length],
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {item.category}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {item.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: COLORS[idx % COLORS.length],
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          ${item.amount.toLocaleString('es-ES', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No hay gastos registrados aún. Crea transacciones para ver el análisis.
              </p>
            </div>
          )}

          {/* Income vs Expenses Chart */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comparación Ingresos vs Gastos
            </h3>
            <div className="flex items-end gap-8 h-48">
              {/* Income Bar */}
              <div className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex flex-col items-center">
                  <div
                    className="w-12 bg-green-500 rounded-t"
                    style={{
                      height: `${
                        totalIncome > 0
                          ? (totalIncome / Math.max(totalIncome, totalExpenses)) * 120
                          : 0
                      }px`,
                    }}
                  ></div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Ingresos</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ${totalIncome.toLocaleString('es-ES', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </div>

              {/* Expenses Bar */}
              <div className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex flex-col items-center">
                  <div
                    className="w-12 bg-red-500 rounded-t"
                    style={{
                      height: `${
                        totalExpenses > 0
                          ? (totalExpenses / Math.max(totalIncome, totalExpenses)) * 120
                          : 0
                      }px`,
                    }}
                  ></div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Gastos</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ${totalExpenses.toLocaleString('es-ES', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-700 font-medium">
              Total de Transacciones: <span className="font-bold">{transactions.length}</span>
            </p>
          </div>
        </div>
    </div>
  )
}
