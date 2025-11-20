import { useEffect, useState } from 'react'
import { DatabaseService, CategoryService } from '@/services'
import { Dashboard, TransactionForm, TransactionList, CategoryManager, Analytics, RecurringTransactionManager, ExportBackupManager, Settings, ExpandableTabs } from '@/components'
import { useToast, ToastContainer } from '@/utils/toast'
import { BookOpen, BarChart3, Clock, HardDrive, Settings as SettingsIcon } from 'lucide-react'
import type { Transaction } from '@/types'

type AppView = 'dashboard' | 'add' | 'list' | 'categories' | 'analytics' | 'recurring' | 'export' | 'settings'

export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<AppView>('dashboard')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showRecurring, setShowRecurring] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { toasts, removeToast } = useToast()

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
            <nav className="flex gap-2">
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
              <ExpandableTabs
                tabs={[
                  { title: 'Categorías', icon: BookOpen },
                  { title: 'Análisis', icon: BarChart3 },
                  { title: 'Recurrentes', icon: Clock },
                  { title: 'Backup', icon: HardDrive },
                  { type: 'separator' },
                  { title: 'Ajustes', icon: SettingsIcon },
                ]}
                onChange={(index) => {
                  if (index === 0) setShowCategoryManager(true)
                  else if (index === 1) setShowAnalytics(true)
                  else if (index === 2) setShowRecurring(true)
                  else if (index === 3) setShowExport(true)
                  else if (index === 5) setShowSettings(true)
                }}
                activeColor="text-blue-600"
              />
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

      {/* Export/Backup Modal */}
      {showExport && (
        <ExportBackupManager onClose={() => setShowExport(false)} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
