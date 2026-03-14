import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import BottomNav from './components/BottomNav'
import Feed from './pages/Feed'
import Post from './pages/Post'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Auth from './pages/Auth'

export default function App() {
  const { token, fetchMe } = useAuthStore()

  useEffect(() => {
    if (token) fetchMe()
  }, [token])

  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Feed />} />
        <Route path="/post" element={<Post />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
