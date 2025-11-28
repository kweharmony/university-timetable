import HomeworkCard from './HomeworkCard'

function HomeworkList({ 
  homework = [], 
  selectedDate, 
  isLoading = false, 
  isAdmin = false,
  onEdit,
  onDelete 
}) {
  const formatSelectedDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Скелетон загрузки
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {formatSelectedDate(selectedDate)}
        </h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-4">
            <div className="skeleton h-5 w-1/3 mb-2" />
            <div className="skeleton h-4 w-full mb-1" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedDate && (
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
          {formatSelectedDate(selectedDate)}
        </h2>
      )}

      {homework.length === 0 ? (
        <div className="card p-8 text-center animate-fade-in">
          <span className="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">
            assignment
          </span>
          <p className="text-gray-500 dark:text-gray-400">
            Нет заданий на эту дату
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {homework.map((item) => (
            <HomeworkCard
              key={item.id}
              homework={item}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomeworkList

