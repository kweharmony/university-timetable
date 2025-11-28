import { useState, useEffect, useCallback } from 'react'
import Calendar from '../components/Calendar'
import HomeworkList from '../components/HomeworkList'
import AddHomeworkModal from '../components/AddHomeworkModal'
import LoginForm from '../components/LoginForm'
import Toast from '../components/Toast'
import { signIn, signOut, getSession, onAuthStateChange } from '../lib/auth'
import { 
  getHomeworkByDate, 
  getHomeworkDatesForMonth, 
  addHomework, 
  updateHomework, 
  deleteHomework 
} from '../lib/homework'

function AdminPage() {
  // Состояние авторизации
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  // Состояние календаря и ДЗ
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  )
  const [homework, setHomework] = useState([])
  const [homeworkDates, setHomeworkDates] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Модальное окно
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Toast уведомления
  const [toast, setToast] = useState(null)

  // Функция показа toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const { session } = await getSession()
      setUser(session?.user || null)
      setIsAuthLoading(false)
    }

    checkAuth()

    // Подписываемся на изменения состояния авторизации
    const unsubscribe = onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => unsubscribe()
  }, [])

  // Загрузка ДЗ
  const loadHomework = useCallback(async (date) => {
    if (!date) return
    
    setIsLoading(true)
    const { data, error } = await getHomeworkByDate(date)
    
    if (!error) {
      setHomework(data)
    }
    setIsLoading(false)
  }, [])

  // Загрузка дат с ДЗ
  const loadHomeworkDates = useCallback(async (y, m) => {
    const { data } = await getHomeworkDatesForMonth(y, m + 1)
    setHomeworkDates(data)
  }, [])

  useEffect(() => {
    if (user) {
      loadHomework(selectedDate)
    }
  }, [selectedDate, user, loadHomework])

  useEffect(() => {
    if (user) {
      loadHomeworkDates(year, month)
    }
  }, [year, month, user, loadHomeworkDates])

  // Обработчик входа
  const handleLogin = async (email, password) => {
    setIsLoginLoading(true)
    const { data, error } = await signIn(email, password)
    setIsLoginLoading(false)

    if (error) {
      throw new Error(error.message || 'Неверный email или пароль')
    }

    setUser(data.user)
    showToast('Вы успешно вошли')
  }

  // Обработчик выхода
  const handleLogout = async () => {
    await signOut()
    setUser(null)
    setHomework([])
    setHomeworkDates([])
    showToast('Вы вышли из системы')
  }

  // Добавление ДЗ
  const handleAddHomework = async (data) => {
    const { data: newHomework, error } = await addHomework(data)
    
    if (error) {
      showToast('Ошибка добавления задания', 'error')
      throw error
    }

    // Обновляем список если добавили на текущую дату
    if (data.homework_date === selectedDate) {
      setHomework(prev => [...prev, newHomework])
    }

    // Обновляем даты с ДЗ
    await loadHomeworkDates(year, month)
    
    showToast('Задание добавлено')
  }

  // Редактирование ДЗ
  const handleEditHomework = async (id, updates) => {
    const { data: updatedHomework, error } = await updateHomework(id, updates)
    
    if (error) {
      showToast('Ошибка обновления задания', 'error')
      return
    }

    setHomework(prev => 
      prev.map(item => item.id === id ? updatedHomework : item)
    )
    
    showToast('Задание обновлено')
  }

  // Удаление ДЗ
  const handleDeleteHomework = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить это задание?')) {
      return
    }

    const { error } = await deleteHomework(id)
    
    if (error) {
      showToast('Ошибка удаления задания', 'error')
      return
    }

    setHomework(prev => prev.filter(item => item.id !== id))
    
    // Обновляем даты с ДЗ
    await loadHomeworkDates(year, month)
    
    showToast('Задание удалено')
  }

  // Показываем загрузку при проверке авторизации
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

  // Показываем форму входа если не авторизован
  if (!user) {
    return (
      <>
        <LoginForm onLogin={handleLogin} isLoading={isLoginLoading} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    )
  }

  // Основной интерфейс администратора
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-dark dark:text-white">
              Панель администратора
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {user.email}
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center gap-2"
          >
            <span className="material-icons text-xl">logout</span>
            Выйти
          </button>
        </header>

        {/* Основной контент */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Календарь */}
          <div>
            <Calendar
              year={year}
              month={month}
              selectedDate={selectedDate}
              homeworkDates={homeworkDates}
              onYearChange={setYear}
              onMonthChange={setMonth}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Список ДЗ */}
          <div>
            <HomeworkList
              homework={homework}
              selectedDate={selectedDate}
              isLoading={isLoading}
              isAdmin={true}
              onEdit={handleEditHomework}
              onDelete={handleDeleteHomework}
            />
          </div>
        </div>

        {/* FAB кнопка добавления */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-accent text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
          aria-label="Добавить задание"
        >
          <span className="material-icons text-2xl">add</span>
        </button>

        {/* Модальное окно добавления */}
        <AddHomeworkModal
          isOpen={isModalOpen}
          selectedDate={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddHomework}
        />

        {/* Toast уведомления */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}

export default AdminPage

