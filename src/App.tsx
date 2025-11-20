import { useEffect, useState } from 'react'
import { DatabaseService, CategoryService } from '@/services'
import { Dashboard, TransactionForm, TransactionList, CategoryManager, Analytics, RecurringTransactionManager } from '@/components'
import type { Transaction } from '@/types'

type AppView = 'dashboard' | 'add' | 'list' | 'categories' | 'analytics' | 'recurring'

export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showRecurring, setShowRecurring] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize IndexedDB
        await DatabaseService.initialize()
        
        // Initialize categories
        await CategoryService.initializeCategories()
        
        setIsReady(true)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error during database initialization'
        setError(message)
        console.error('App initialization failed:', err)
      }
    }

    initializeApp()

    // Cleanup on unmount
    return () => {
      DatabaseService.close()
    }
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600">Cargando...</h1>
        </div>
      </div>
    )
  }

  const handleAddSuccess = () => {
    setCurrentView('list')
    setEditingTransaction(null)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setCurrentView('add')
  }

  const handleCancelForm = () => {
    setEditingTransaction(null)
    setCurrentView('dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💰 Finanzas Personales</h1>
              <p className="text-gray-500 text-sm">Gestiona tus ingresos y gastos</p>
            </div>
            <nav className="flex gap-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Transacciones
              </button>
              <button
                onClick={() => setShowCategoryManager(true)}
                className="px-4 py-2 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                📁 Categorías
              </button>
              <button
                onClick={() => setShowAnalytics(true)}
                className="px-4 py-2 rounded-lg font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors"
              >
                📊 Análisis
              </button>
              <button
                onClick={() => setShowRecurring(true)}
                className="px-4 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                ⏱️ Recurrentes
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'dashboard' && <Dashboard onAddTransaction={() => setCurrentView('add')} />}

        {currentView === 'add' && (
          <div className="flex justify-center">
            <TransactionForm
              onSuccess={handleAddSuccess}
              onCancel={handleCancelForm}
              editingTransaction={editingTransaction}
            />
          </div>
        )}

        {currentView === 'list' && (
          <TransactionList onEdit={handleEditTransaction} refreshTrigger={refreshTrigger} />
        )}
      </main>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager onClose={() => setShowCategoryManager(false)} />
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <Analytics onClose={() => setShowAnalytics(false)} />
      )}

      {/* Recurring Transaction Manager Modal */}
      {showRecurring && (
        <RecurringTransactionManager onClose={() => setShowRecurring(false)} />
      )}
    </div>
  )
}
