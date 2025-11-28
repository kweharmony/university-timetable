import { useMemo } from 'react'
import YearMonthSelector from './YearMonthSelector'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function Calendar({ 
  year, 
  month, 
  selectedDate, 
  homeworkDates = [], 
  onYearChange, 
  onMonthChange, 
  onDateSelect 
}) {
  // Получаем информацию о текущем дне
  const today = useMemo(() => {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate()
    }
  }, [])

  // Генерируем дни месяца
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    // Определяем день недели первого числа (0 = воскресенье, преобразуем в 0 = понедельник)
    let startDay = firstDay.getDay() - 1
    if (startDay < 0) startDay = 6
    
    const days = []
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, isCurrentMonth: false })
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      days.push({
        day,
        dateString,
        isCurrentMonth: true,
        isToday: year === today.year && month === today.month && day === today.day,
        isSelected: selectedDate === dateString,
        hasHomework: homeworkDates.includes(dateString)
      })
    }
    
    return days
  }, [year, month, selectedDate, homeworkDates, today])

  return (
    <div className="card p-4 md:p-6">
      {/* Селектор месяца и года */}
      <YearMonthSelector
        year={year}
        month={month}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
      />

      {/* Заголовки дней недели */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Сетка дней */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((item, index) => (
          <button
            key={index}
            onClick={() => item.day && onDateSelect(item.dateString)}
            disabled={!item.day}
            className={`
              relative aspect-square flex items-center justify-center rounded-lg text-sm font-medium
              transition-all duration-200
              ${!item.day ? 'cursor-default' : 'cursor-pointer'}
              ${item.isSelected 
                ? 'bg-primary-accent text-white shadow-md' 
                : item.isToday
                  ? 'bg-primary-accent/20 text-primary-accent dark:bg-primary-accent/30'
                  : item.day
                    ? 'hover:bg-gray-100 dark:hover:bg-dark-border text-gray-700 dark:text-gray-200'
                    : ''
              }
            `}
          >
            {item.day}
            {/* Индикатор наличия ДЗ */}
            {item.hasHomework && !item.isSelected && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Кнопка "Сегодня" */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {
            onYearChange(today.year)
            onMonthChange(today.month)
            const todayString = `${today.year}-${String(today.month + 1).padStart(2, '0')}-${String(today.day).padStart(2, '0')}`
            onDateSelect(todayString)
          }}
          className="btn-secondary text-sm"
        >
          <span className="flex items-center gap-1">
            <span className="material-icons text-base">today</span>
            Сегодня
          </span>
        </button>
      </div>
    </div>
  )
}

export default Calendar

