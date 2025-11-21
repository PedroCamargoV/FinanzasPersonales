import { useDarkMode } from '@/utils/darkMode'

interface SettingsProps {
  onClose: () => void
}

export function Settings({ onClose }: SettingsProps) {
  const { isDark, toggle } = useDarkMode()

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900">⚙️ Configuración</h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Display Settings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Apariencia</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Modo Oscuro</p>
              <p className="text-sm text-gray-600">Activa el tema oscuro para reducir el cansancio visual</p>
            </div>
            <button
              onClick={toggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isDark ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ Información</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-gray-600">Aplicación</span>
              <span className="font-medium text-gray-900">Finanzas Personales</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-gray-600">Versión</span>
              <span className="font-medium text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-gray-600">Almacenamiento</span>
              <span className="font-medium text-gray-900">IndexedDB</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Consejos</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 space-y-2">
            <p>• Realiza backups regularmente desde la sección de Backup</p>
            <p>• Usa categorías para mejor análisis de gastos</p>
            <p>• Las transacciones recurrentes se generan automáticamente</p>
            <p>• Consulta el análisis para entender tus patrones de gasto</p>
          </div>
        </div>
      </div>
    </div>
  )
}
