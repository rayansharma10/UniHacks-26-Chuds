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

export default function App() {
  const { token, user, fetchMe } = useAuthStore()
  const location = useLocation()
  const isAuth = location.pathname === '/auth'

  useEffect(() => {
    if (token && !user) fetchMe()
  }, [token, user])

  // If not authenticated and not on auth page, redirect to auth
  if (!token && !isAuth) {
    return <Navigate to="/auth" replace />
  }

  // If authenticated and on auth page, redirect to home
  if (token && isAuth) {
    return <Navigate to="/" replace />
  }

  if (isAuth) return <Auth />

  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <SideNav />

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/post" element={<Post />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai" element={<AI />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </main>

      <RightPanel />

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
