import { useTheme } from '../contexts/ThemeContext'

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white dark:bg-dark-surface shadow-md border border-gray-100 dark:border-dark-border hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
    >
      <span className="material-icons text-primary-accent">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}

export default ThemeToggle

