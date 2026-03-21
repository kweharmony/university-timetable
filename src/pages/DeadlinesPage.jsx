import { useState, useEffect } from 'react'
import { getDeadlines } from '../lib/deadlines'

function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await getDeadlines()
      setDeadlines(data)
      setIsLoading(false)
    }
    load()
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getDaysLeft = (endDate) => {
    const end = new Date(endDate + 'T00:00:00')
    const diff = end - today
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
  }

  const getProgressPercent = (startDate, endDate) => {
    const start = new Date(startDate + 'T00:00:00')
    const end = new Date(endDate + 'T00:00:00')
    const total = end - start
    const elapsed = today - start
    if (elapsed <= 0) return 0
    if (elapsed >= total) return 100
    return Math.round((elapsed / total) * 100)
  }

  // Группировка по предметам
  const grouped = deadlines.reduce((acc, d) => {
    if (!acc[d.subject]) acc[d.subject] = []
    acc[d.subject].push(d)
    return acc
  }, {})

  const subjectMeta = {
    'ИТиП': { full: 'Информационные технологии и программирование', icon: 'code', color: 'purple' },
    'СиАОД': { full: 'Структуры и алгоритмы обработки данных', icon: 'account_tree', color: 'blue' },
    'DevOps': { full: 'Основы DevOps', icon: 'cloud', color: 'green' },
  }

  const colorClasses = {
    purple: {
      badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      progress: 'bg-purple-500',
      progressBg: 'bg-purple-100 dark:bg-purple-900/30',
      icon: 'text-purple-500',
    },
    blue: {
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      progress: 'bg-blue-500',
      progressBg: 'bg-blue-100 dark:bg-blue-900/30',
      icon: 'text-blue-500',
    },
    green: {
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      progress: 'bg-emerald-500',
      progressBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      icon: 'text-emerald-500',
    },
  }

  // Собираем срочные дедлайны (≤5 дней)
  const urgentDeadlines = deadlines.filter(d => {
    const days = getDaysLeft(d.end_date)
    return days >= 0 && days <= 5
  })

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="skeleton h-9 w-64 mx-auto mb-2" />
            <div className="skeleton h-5 w-80 mx-auto" />
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 mb-6">
              <div className="skeleton h-7 w-48 mb-4" />
              <div className="space-y-3">
                <div className="skeleton h-16 w-full" />
                <div className="skeleton h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark dark:text-white mb-2">
            Дедлайны лабораторных
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Сроки сдачи лабораторных работ по предметам
          </p>
          <a
            href="#/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary-accent bg-primary-accent/10 hover:bg-primary-accent/20 transition-colors"
          >
            <span className="material-icons text-lg">arrow_back</span>
            На главную
          </a>
        </header>

        {/* Срочные дедлайны */}
        {urgentDeadlines.length > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-red-500">warning</span>
              <h2 className="text-lg font-bold text-red-700 dark:text-red-300">
                Скоро истекают!
              </h2>
            </div>
            <div className="space-y-2">
              {urgentDeadlines.map(d => {
                const days = getDaysLeft(d.end_date)
                return (
                  <div key={d.id} className="flex items-center justify-between bg-white/60 dark:bg-dark-surface/60 rounded-lg px-4 py-2">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {d.subject} — Лаб №{d.lab_number}
                    </span>
                    <span className={`text-sm font-bold ${days <= 2 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {days === 0 ? 'Сегодня!' : days === 1 ? 'Завтра!' : `${days} дн.`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Предметы */}
        {Object.entries(grouped).map(([subject, labs]) => {
          const meta = subjectMeta[subject] || { full: subject, icon: 'school', color: 'purple' }
          const colors = colorClasses[meta.color] || colorClasses.purple

          return (
            <div key={subject} className="card p-6 mb-6 animate-slide-up">
              {/* Заголовок предмета */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.badge}`}>
                  <span className="material-icons text-xl">{meta.icon}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary-dark dark:text-white">
                    {subject}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {meta.full}
                  </p>
                </div>
              </div>

              {/* Лабораторные */}
              <div className="space-y-3">
                {labs.map(lab => {
                  const daysLeft = getDaysLeft(lab.end_date)
                  const progress = getProgressPercent(lab.start_date, lab.end_date)
                  const isExpired = daysLeft < 0
                  const isUrgent = daysLeft >= 0 && daysLeft <= 5

                  return (
                    <div
                      key={lab.id}
                      className={`rounded-lg border p-4 transition-colors ${
                        isExpired
                          ? 'border-gray-200 bg-gray-50 dark:border-dark-border dark:bg-dark-surface/50 opacity-60'
                          : isUrgent
                          ? 'border-red-200 bg-red-50/50 dark:border-red-800/50 dark:bg-red-900/10'
                          : 'border-gray-100 bg-white dark:border-dark-border dark:bg-dark-surface'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-primary-dark dark:text-white">
                          Лабораторная №{lab.lab_number}
                        </span>
                        {isExpired ? (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-500 dark:bg-dark-border dark:text-gray-400">
                            Истёк
                          </span>
                        ) : isUrgent ? (
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
                            {daysLeft === 0 ? 'Сегодня!' : daysLeft === 1 ? 'Завтра!' : `${daysLeft} дн.`}
                          </span>
                        ) : (
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.badge}`}>
                            {daysLeft} дн.
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className="material-icons text-base">date_range</span>
                        {formatDate(lab.start_date)} → {formatDate(lab.end_date)}
                      </div>

                      {/* Прогресс-бар */}
                      {!isExpired && (
                        <div className={`h-1.5 rounded-full ${colors.progressBg}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isUrgent ? 'bg-red-500' : colors.progress
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Навигация */}
        <footer className="mt-12 text-center">
          <a
            href="#/admin/deadlines"
            className="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500 hover:text-primary-accent dark:hover:text-primary-accent transition-colors"
          >
            <span className="material-icons text-base">lock</span>
            Управление дедлайнами
          </a>
        </footer>
      </div>
    </div>
  )
}

export default DeadlinesPage
