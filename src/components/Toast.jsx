import { useEffect, useState } from 'react'

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
    }, 16)

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [onClose, duration])

  const config = {
    success: {
      icon: 'check_circle',
      bg: 'bg-white dark:bg-dark-surface',
      border: 'border-green-400 dark:border-green-500',
      iconColor: 'text-green-500',
      progressColor: 'bg-green-500',
    },
    error: {
      icon: 'error',
      bg: 'bg-white dark:bg-dark-surface',
      border: 'border-red-400 dark:border-red-500',
      iconColor: 'text-red-500',
      progressColor: 'bg-red-500',
    },
    info: {
      icon: 'info',
      bg: 'bg-white dark:bg-dark-surface',
      border: 'border-primary-accent',
      iconColor: 'text-primary-accent',
      progressColor: 'bg-primary-accent',
    },
  }

  const c = config[type] || config.info

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className={`${c.bg} ${c.border} border rounded-xl shadow-lg overflow-hidden min-w-[280px] max-w-[90vw]`}>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className={`material-icons text-xl ${c.iconColor}`}>{c.icon}</span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{message}</span>
          <button
            onClick={onClose}
            className="ml-auto p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
            aria-label="Закрыть"
          >
            <span className="material-icons text-base">close</span>
          </button>
        </div>
        <div className="h-0.5 w-full bg-gray-100 dark:bg-dark-border">
          <div
            className={`h-full ${c.progressColor} transition-none`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default Toast
