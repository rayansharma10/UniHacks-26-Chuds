import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import DilemmaCard from '../components/DilemmaCard'
import { LogOut, Loader2 } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const { data: myDilemmas, isLoading } = useQuery({
    queryKey: ['my-dilemmas'],
    queryFn: () => api.get('/dilemmas/mine').then((r) => r.data),
    enabled: !!user,
  })

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
        <p style={{ color: 'var(--muted-foreground)' }}>You're not signed in.</p>
        <button
          onClick={() => navigate('/auth')}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="px-6 pt-8 pb-20 md:pb-8 flex flex-col gap-6 w-full">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold shrink-0" style={{ backgroundColor: 'var(--primary)', opacity: 0.2, color: 'var(--primary)' }}>
          {user.username[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xl">{user.username}</p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>{user.points ?? 0}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Total Points</p>
        </div>
        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <p className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>#{user.season_rank ?? '—'}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Season Rank</p>
        </div>
      </div>

      {/* My dilemmas */}
      <h3 className="font-semibold text-sm uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>My Dilemmas</h3>

      {isLoading && (
        <div className="flex justify-center pt-8">
          <Loader2 className="animate-spin" size={24} style={{ color: 'var(--primary)' }} />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {myDilemmas?.map((d) => <DilemmaCard key={d.id} dilemma={d} />)}
        {!isLoading && !myDilemmas?.length && (
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>You haven't posted any dilemmas yet.</p>
        )}
      </div>
    </div>
  )
}
