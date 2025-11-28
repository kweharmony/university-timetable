import { useState } from 'react'

function HomeworkCard({ 
  homework, 
  isAdmin = false, 
  onEdit, 
  onDelete,
  isLoading = false 
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editSubject, setEditSubject] = useState(homework.subject)
  const [editTask, setEditTask] = useState(homework.task)

  const handleSave = () => {
    if (editSubject.trim() && editTask.trim()) {
      onEdit(homework.id, {
        subject: editSubject.trim(),
        task: editTask.trim()
      })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditSubject(homework.subject)
    setEditTask(homework.task)
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isEditing && isAdmin) {
    return (
      <div className="card p-4 animate-fade-in">
        <input
          type="text"
          value={editSubject}
          onChange={(e) => setEditSubject(e.target.value)}
          placeholder="Название предмета"
          className="input-field mb-3 font-semibold"
          autoFocus
        />
        <textarea
          value={editTask}
          onChange={(e) => setEditTask(e.target.value)}
          placeholder="Описание задания"
          rows={3}
          className="textarea-field mb-3"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="btn-secondary text-sm"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={!editSubject.trim() || !editTask.trim()}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Сохранить
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`card p-4 animate-slide-up ${isLoading ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {homework.subject}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap break-words">
            {homework.task}
          </p>
          {homework.created_at && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
              Добавлено: {formatDate(homework.created_at)}
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
              aria-label="Редактировать"
            >
              <span className="material-icons text-gray-500 dark:text-gray-400 text-xl">
                edit
              </span>
            </button>
            <button
              onClick={() => onDelete(homework.id)}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Удалить"
            >
              <span className="material-icons text-red-500 text-xl">
                close
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeworkCard

