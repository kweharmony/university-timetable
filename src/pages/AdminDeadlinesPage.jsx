import { useState, useEffect } from 'react'
import LoginForm from '../components/LoginForm'
import Toast from '../components/Toast'
import { signIn, signOut, getSession, onAuthStateChange } from '../lib/auth'
import { getDeadlines, updateDeadline, addDeadline, deleteDeadline, INITIAL_DEADLINES } from '../lib/deadlines'

function AdminDeadlinesPage() {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [deadlines, setDeadlines] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  // Авторизация
  useEffect(() => {
    const checkAuth = async () => {
      const { session } = await getSession()
      setUser(session?.user || null)
      setIsAuthLoading(false)
    }
    checkAuth()

    const unsubscribe = onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })
    return () => unsubscribe()
  }, [])

  // Загрузка дедлайнов
  useEffect(() => {
    if (user) {
      loadDeadlines()
    }
  }, [user])

  const loadDeadlines = async () => {
    setIsLoading(true)
    const { data } = await getDeadlines()
    setDeadlines(data)
    setIsLoading(false)
  }

  const handleLogin = async (email, password) => {
    setIsLoginLoading(true)
    const { data, error } = await signIn(email, password)
    setIsLoginLoading(false)
    if (error) throw new Error(error.message || 'Неверный email или пароль')
    setUser(data.user)
    showToast('Вы успешно вошли')
  }

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    setDeadlines([])
    showToast('Вы вышли из системы')
  }

  // Заполнить начальными данными
  const handleSeedData = async () => {
    if (!window.confirm('Заполнить таблицу начальными дедлайнами? Существующие данные не будут затронуты.')) return

    for (const d of INITIAL_DEADLINES) {
      await addDeadline(d)
    }
    await loadDeadlines()
    showToast('Дедлайны добавлены')
  }

  // Начать редактирование
  const startEdit = (deadline) => {
    setEditingId(deadline.id)
    setEditData({
      start_date: deadline.start_date,
      end_date: deadline.end_date,
    })
  }

  // Сохранить изменения
  const handleSave = async (id) => {
    const { error } = await updateDeadline(id, editData)
    if (error) {
      showToast('Ошибка сохранения', 'error')
      return
    }
    setDeadlines(prev =>
      prev.map(d => d.id === id ? { ...d, ...editData } : d)
    )
    setEditingId(null)
    showToast('Дедлайн обновлён')
  }

  // Удалить дедлайн
  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот дедлайн?')) return
    const { error } = await deleteDeadline(id)
    if (error) {
      showToast('Ошибка удаления', 'error')
      return
    }
    setDeadlines(prev => prev.filter(d => d.id !== id))
    showToast('Дедлайн удалён')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  // Группировка по предметам
  const grouped = deadlines.reduce((acc, d) => {
    if (!acc[d.subject]) acc[d.subject] = []
    acc[d.subject].push(d)
    return acc
  }, {})

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="w-12 h-12 border-4 border-primary-accent/30 border-t-primary-accent rounded-full animate-spin inline-block" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <LoginForm onLogin={handleLogin} isLoading={isLoginLoading} />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-dark dark:text-white">
              Управление дедлайнами
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a href="#/admin" className="btn-secondary flex items-center gap-2">
              <span className="material-icons text-xl">assignment</span>
              ДЗ
            </a>
            <button onClick={handleSeedData} className="btn-secondary flex items-center gap-2">
              <span className="material-icons text-xl">playlist_add</span>
              Заполнить
            </button>
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
              <span className="material-icons text-xl">logout</span>
              Выйти
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-6">
                <div className="skeleton h-7 w-48 mb-4" />
                <div className="space-y-3">
                  <div className="skeleton h-14 w-full" />
                  <div className="skeleton h-14 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : deadlines.length === 0 ? (
          <div className="card p-12 text-center">
            <span className="material-icons text-5xl text-gray-300 dark:text-gray-600 mb-4 block">event_busy</span>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Дедлайнов пока нет</p>
            <button onClick={handleSeedData} className="btn-primary">
              Заполнить начальными данными
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([subject, labs]) => (
              <div key={subject} className="card p-6 animate-slide-up">
                <h2 className="text-lg font-bold text-primary-dark dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-icons text-primary-accent">school</span>
                  {subject}
                </h2>

                <div className="space-y-3">
                  {labs.map(lab => (
                    <div key={lab.id} className="rounded-lg border border-gray-100 dark:border-dark-border p-4 bg-gray-50/50 dark:bg-dark-bg/50">
                      {editingId === lab.id ? (
                        /* Режим редактирования */
                        <div>
                          <div className="font-semibold text-primary-dark dark:text-white mb-3">
                            Лабораторная №{lab.lab_number}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Начало</label>
                              <input
                                type="date"
                                value={editData.start_date}
                                onChange={e => setEditData(prev => ({ ...prev, start_date: e.target.value }))}
                                className="input-field text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Дедлайн</label>
                              <input
                                type="date"
                                value={editData.end_date}
                                onChange={e => setEditData(prev => ({ ...prev, end_date: e.target.value }))}
                                className="input-field text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleSave(lab.id)} className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1">
                              <span className="material-icons text-base">check</span>
                              Сохранить
                            </button>
                            <button onClick={cancelEdit} className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-1">
                              <span className="material-icons text-base">close</span>
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Режим просмотра */
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-primary-dark dark:text-white">
                              Лабораторная №{lab.lab_number}
                            </span>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                              <span className="material-icons text-base">date_range</span>
                              {new Date(lab.start_date + 'T00:00:00').toLocaleDateString('ru-RU')} → {new Date(lab.end_date + 'T00:00:00').toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => startEdit(lab)}
                              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
                              aria-label="Редактировать"
                            >
                              <span className="material-icons text-xl text-gray-500 dark:text-gray-400">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(lab.id)}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                              aria-label="Удалить"
                            >
                              <span className="material-icons text-xl text-red-400">delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  )
}

export default AdminDeadlinesPage
