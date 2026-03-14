import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import api from '../lib/api'
import DilemmaCard from '../components/DilemmaCard'
import { LogOut, Loader2 } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useAuthStore()

  const { data: myDilemmas, isLoading } = useQuery({
    queryKey: ['my-dilemmas'],
    queryFn: () => api.get('/dilemmas/mine').then((r) => r.data),
    enabled: !!user,
  })

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-4 pb-24">
        <p className="text-[#888] text-sm">Sign in to see your profile.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col px-4 pt-12 pb-24 gap-6">
      {/* Profile header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center text-xl font-bold text-[#ff6b4a]">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold">{user.username}</p>
            <p className="text-sm text-[#888]">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-xl bg-white/5 text-[#888] hover:text-white transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-2xl font-bold text-[#ff6b4a]">{user.points ?? 0}</p>
          <p className="text-xs text-[#888] mt-1">Total Points</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]">
          <p className="text-2xl font-bold text-[#ff6b4a]">#{user.season_rank ?? '—'}</p>
          <p className="text-xs text-[#888] mt-1">Season Rank</p>
        </div>
      </div>

      {/* My dilemmas */}
      <h3 className="font-semibold text-sm text-[#888] uppercase tracking-wide">My Dilemmas</h3>

      {isLoading && (
        <div className="flex justify-center pt-8">
          <Loader2 className="animate-spin text-[#ff6b4a]" size={24} />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {myDilemmas?.map((d) => <DilemmaCard key={d.id} dilemma={d} />)}
        {!isLoading && !myDilemmas?.length && (
          <p className="text-[#888] text-sm text-center">You haven't posted any dilemmas yet.</p>
        )}
      </div>
    </div>
  )
}
