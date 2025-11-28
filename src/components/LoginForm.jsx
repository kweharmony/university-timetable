import { useState } from 'react'

function LoginForm({ onLogin, isLoading = false }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Заполните все поля')
      return
    }

    try {
      await onLogin(email.trim(), password)
    } catch (err) {
      setError(err.message || 'Ошибка входа')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <span className="material-icons text-5xl text-primary-accent mb-3">
              admin_panel_settings
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Панель администратора
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Войдите для управления заданиями
            </p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="input-field"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Вход...
                </span>
              ) : (
                'Войти'
              )}
            </button>
          </form>

          {/* Ссылка на главную */}
          <div className="mt-6 text-center">
            <a 
              href="#/" 
              className="text-sm text-primary-accent hover:underline"
            >
              ← Вернуться на главную
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm

