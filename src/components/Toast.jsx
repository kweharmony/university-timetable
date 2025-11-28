import { useEffect } from 'react'

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  const bgColor = type === 'success' 
    ? 'bg-green-500' 
    : type === 'error' 
      ? 'bg-red-500' 
      : 'bg-gray-700'

  const icon = type === 'success' 
    ? 'check_circle' 
    : type === 'error' 
      ? 'error' 
      : 'info'

  return (
    <div className={`toast ${bgColor}`}>
      <div className="flex items-center gap-2">
        <span className="material-icons text-xl">{icon}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 rounded hover:bg-white/20 transition-colors"
          aria-label="Закрыть"
        >
          <span className="material-icons text-sm">close</span>
        </button>
      </div>
    </div>
  )
}

export default Toast

