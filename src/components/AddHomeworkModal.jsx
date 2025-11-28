import { useState, useEffect, useRef } from 'react'

function AddHomeworkModal({ isOpen, selectedDate, onClose, onAdd }) {
  const [subject, setSubject] = useState('')
  const [task, setTask] = useState('')
  const [date, setDate] = useState(selectedDate || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setDate(selectedDate || '')
  }, [selectedDate])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Закрытие по клику вне модалки
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Блокируем скролл страницы
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!subject.trim() || !task.trim() || !date) return

    setIsSubmitting(true)
    
    try {
      await onAdd({
        subject: subject.trim(),
        task: task.trim(),
        homework_date: date
      })
      
      // Очищаем форму
      setSubject('')
      setTask('')
      onClose()
    } catch (error) {
      console.error('Ошибка добавления:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        ref={modalRef}
        className="w-full max-w-md bg-white dark:bg-dark-surface rounded-2xl shadow-2xl animate-scale-in"
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-border">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Новое задание
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
            aria-label="Закрыть"
          >
            <span className="material-icons text-gray-500">close</span>
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Предмет */}
          <div>
            <label 
              htmlFor="subject" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Предмет
            </label>
            <input
              ref={inputRef}
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Например: Математика"
              className="input-field"
              required
            />
          </div>

          {/* Задание */}
          <div>
            <label 
              htmlFor="task" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Описание задания
            </label>
            <textarea
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Опишите задание..."
              rows={4}
              className="textarea-field"
              required
            />
          </div>

          {/* Дата */}
          <div>
            <label 
              htmlFor="date" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Дата сдачи
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!subject.trim() || !task.trim() || !date || isSubmitting}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Сохранение...
                </span>
              ) : (
                'Сохранить'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddHomeworkModal

