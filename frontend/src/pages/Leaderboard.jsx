import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { Trophy, Loader2 } from 'lucide-react'

export default function Leaderboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => api.get('/users/leaderboard').then((r) => r.data),
  })

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="px-6 pt-8 pb-20 md:pb-8 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Trophy className="text-[#ff6b4a]" size={22} />
        <h2 className="text-xl font-bold">Top Voices</h2>
      </div>

      {isLoading && (
        <div className="flex justify-center pt-16">
          <Loader2 className="animate-spin text-[#ff6b4a]" size={28} />
        </div>
      )}

      <div className="flex flex-col gap-3 max-w-xl">
        {data?.map((user, i) => (
          <div
            key={user.id}
            className="flex items-center gap-4 bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a] hover:border-[#ff6b4a]/30 transition-colors"
          >
            <span className="text-xl w-8 text-center shrink-0">{medals[i] ?? `#${i + 1}`}</span>
            <div className="w-10 h-10 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center font-bold text-[#ff6b4a]">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-[#888]">{user.points} pts</p>
            </div>
            {i === 0 && (
              <span className="text-xs bg-[#ff6b4a]/20 text-[#ff6b4a] px-2.5 py-1 rounded-full font-semibold">
                Top Judge
              </span>
            )}
          </div>
        ))}
        {!isLoading && !data?.length && (
          <p className="text-[#888] text-sm">No rankings yet.</p>
        )}
      </div>
    </div>
  )
}
