import { useEffect, useState } from 'react'

export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Database initialization will be added in Task 17
    // For now, just mark as ready for dev
    setIsReady(true)
  }, [setError])

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
            <p className="text-gray-400">⏳ IndexedDB setup (pending Task 17)</p>
            <p className="text-gray-400">⏳ Services implementation (pending)</p>
          </div>
        </div>
      </main>
    </div>
  )
}
