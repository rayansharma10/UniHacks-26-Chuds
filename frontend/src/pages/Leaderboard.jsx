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
        <Trophy size={22} style={{ color: 'var(--primary)' }} />
        <h2 className="text-xl font-bold">Top Voices</h2>
      </div>

      {isLoading && (
        <div className="flex justify-center pt-16">
          <Loader2 className="animate-spin" size={28} style={{ color: 'var(--primary)' }} />
        </div>
      )}

      <div className="flex flex-col gap-3 max-w-xl">
        {data?.map((user, i) => (
          <div
            key={user.id}
            className="flex items-center gap-4 rounded-xl p-4 border transition-colors"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
            onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
          >
            <span className="text-xl w-8 text-center shrink-0">{medals[i] ?? `#${i + 1}`}</span>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--primary)', opacity: 0.2, color: 'var(--primary)' }}>
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{user.points} pts</p>
            </div>
            {i === 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: 'var(--primary)', opacity: 0.2, color: 'var(--primary)' }}>
                Top Judge
              </span>
            )}
          </div>
        ))}
        {!isLoading && !data?.length && (
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No rankings yet.</p>
        )}
      </div>
    </div>
  )
}
