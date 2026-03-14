import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Trophy, TrendingUp } from 'lucide-react'

export default function RightPanel() {
  const navigate = useNavigate()

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/users/leaderboard').then((r) => r.data),
  })

  const medals = ['🥇', '🥈', '🥉']

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 border-l border-[#2a2a2a] px-4 py-6 gap-6 overflow-y-auto">
      {/* Mini leaderboard */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={15} className="text-[#ff6b4a]" />
            <span className="text-sm font-semibold">Top Judges</span>
          </div>
          <button
            onClick={() => navigate('/leaderboard')}
            className="text-xs text-[#ff6b4a] hover:underline"
          >
            See all
          </button>
        </div>
        {leaderboard?.slice(0, 5).map((user, i) => (
          <div key={user.id} className="flex items-center gap-2">
            <span className="text-base w-6 text-center">{medals[i] ?? `#${i + 1}`}</span>
            <div className="w-7 h-7 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center text-xs font-bold text-[#ff6b4a] shrink-0">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.username}</p>
            </div>
            <span className="text-xs text-[#888] shrink-0">{user.points} pts</span>
          </div>
        ))}
        {!leaderboard?.length && (
          <p className="text-xs text-[#888]">No rankings yet.</p>
        )}
      </div>

      {/* How it works */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-[#ff6b4a]" />
          <span className="text-sm font-semibold">How it works</span>
        </div>
        {[
          ['🗳️', 'Vote on dilemmas'],
          ['🤖', 'AI scores your reasoning'],
          ['🏆', 'Climb the leaderboard'],
          ['🏛️', 'Civic votes become real submissions'],
        ].map(([emoji, text]) => (
          <div key={text} className="flex items-center gap-2 text-xs text-[#888]">
            <span>{emoji}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
