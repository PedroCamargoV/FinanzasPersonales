import { useEffect, useState } from 'react'
import { DatabaseService } from '@/services'

export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initTime, setInitTime] = useState<number>(0)

  useEffect(() => {
    const initializeApp = async () => {
      const startTime = performance.now()

      try {
        // Initialize IndexedDB
        await DatabaseService.initialize()

        const endTime = performance.now()
        setInitTime(Math.round((endTime - startTime) * 100) / 100)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Finanzas Personales</h1>
          <p className="text-gray-500 text-sm">Phase 1 - Foundation Setup</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
          <div className="space-y-2">
            <p className="text-green-600">✅ React 18 with TypeScript configured</p>
            <p className="text-green-600">✅ Tailwind CSS initialized</p>
            <p className="text-green-600">✅ IndexedDB initialized ({initTime}ms)</p>
            <p className="text-green-600">✅ DatabaseService ready</p>
            <p className="text-gray-400">⏳ CategoryService (pending)</p>
            <p className="text-gray-400">⏳ TransactionService (pending)</p>
          </div>
        </div>
      </main>
    </div>
  )
}
