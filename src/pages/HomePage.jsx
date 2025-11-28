import { useState, useEffect, useCallback } from 'react'
import Calendar from '../components/Calendar'
import HomeworkList from '../components/HomeworkList'
import { getHomeworkByDate, getHomeworkDatesForMonth } from '../lib/homework'

function HomePage() {
  // Инициализируем с текущей датой
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  )
  const [homework, setHomework] = useState([])
  const [homeworkDates, setHomeworkDates] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Загружаем ДЗ для выбранной даты
  const loadHomework = useCallback(async (date) => {
    if (!date) return
    
    setIsLoading(true)
    const { data, error } = await getHomeworkByDate(date)
    
    if (!error) {
      setHomework(data)
    }
    setIsLoading(false)
  }, [])

  // Загружаем даты с ДЗ для текущего месяца
  const loadHomeworkDates = useCallback(async (y, m) => {
    const { data } = await getHomeworkDatesForMonth(y, m + 1)
    setHomeworkDates(data)
  }, [])

  // Загружаем ДЗ при изменении даты
  useEffect(() => {
    loadHomework(selectedDate)
  }, [selectedDate, loadHomework])

  // Загружаем даты с ДЗ при изменении месяца
  useEffect(() => {
    loadHomeworkDates(year, month)
  }, [year, month, loadHomeworkDates])

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark dark:text-white mb-2">
            Домашние задания
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Выберите дату, чтобы посмотреть задания
          </p>
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
              isAdmin={false}
            />
          </div>
        </div>

        {/* Ссылка на админку */}
        <footer className="mt-12 text-center">
          <a 
            href="#/admin" 
            className="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500 hover:text-primary-accent dark:hover:text-primary-accent transition-colors"
          >
            <span className="material-icons text-base">lock</span>
            Панель администратора
          </a>
        </footer>
      </div>
    </div>
  )
}

export default HomePage

