import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import DeadlinesPage from './pages/DeadlinesPage'
import AdminDeadlinesPage from './pages/AdminDeadlinesPage'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <div className="min-h-screen">
      {/* Фиксированный переключатель темы */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/deadlines" element={<DeadlinesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/deadlines" element={<AdminDeadlinesPage />} />
      </Routes>
    </div>
  )
}

export default App

