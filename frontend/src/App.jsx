import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import BottomNav from './components/BottomNav'
import SideNav from './components/SideNav'
import RightPanel from './components/RightPanel'
import Feed from './pages/Feed'
import Post from './pages/Post'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import AI from './pages/AI'
import About from './pages/About'

function RequireAuth({ children }) {
  const { token } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function AppShell() {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <SideNav />
      <main className="flex-1 min-w-0 flex flex-col">
        <Routes>
          <Route path="/feed" element={<Feed />} />
          <Route path="/post" element={<RequireAuth><Post /></RequireAuth>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/ai" element={<AI />} />
          <Route path="*" element={<Navigate to="/feed" />} />
        </Routes>
      </main>
      <RightPanel />
      <BottomNav />
    </div>
  )
}

export default function App() {
  const { token, fetchMe } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (token) fetchMe()
  }, [token])

  return (
    <Routes>
      <Route path="/" element={<About />} />
      <Route path="/login" element={token ? <Navigate to="/feed" replace /> : <Auth />} />
      <Route path="/*" element={<AppShell />} />
    </Routes>
  )
}
