const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const YEARS = Array.from({ length: 6 }, (_, i) => 2024 + i) // 2024-2029

function YearMonthSelector({ year, month, onYearChange, onMonthChange }) {
  const handlePrevMonth = () => {
    if (month === 0) {
      if (year > YEARS[0]) {
        onYearChange(year - 1)
        onMonthChange(11)
      }
    } else {
      onMonthChange(month - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      if (year < YEARS[YEARS.length - 1]) {
        onYearChange(year + 1)
        onMonthChange(0)
      }
    } else {
      onMonthChange(month + 1)
    }
  }

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Кнопка назад */}
      <button
        onClick={handlePrevMonth}
        disabled={year === YEARS[0] && month === 0}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Предыдущий месяц"
      >
        <span className="material-icons text-gray-600 dark:text-gray-300">
          chevron_left
        </span>
      </button>

      {/* Селекторы месяца и года */}
      <div className="flex items-center gap-2">
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="px-3 py-2 rounded-lg bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-gray-900 dark:text-gray-100 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-accent"
        >
          {MONTHS.map((name, index) => (
            <option key={index} value={index}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="px-3 py-2 rounded-lg bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-gray-900 dark:text-gray-100 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-accent"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Кнопка вперёд */}
      <button
        onClick={handleNextMonth}
        disabled={year === YEARS[YEARS.length - 1] && month === 11}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Следующий месяц"
      >
        <span className="material-icons text-gray-600 dark:text-gray-300">
          chevron_right
        </span>
      </button>
    </div>
  )
}

export default YearMonthSelector

