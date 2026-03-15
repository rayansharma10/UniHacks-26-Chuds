import { useQuery } from '@tanstack/react-query'
import { useFeedStore } from '../stores/feedStore'
import api from '../lib/api'
import { Globe } from 'lucide-react'
import sidebarImage from '../assets/sidebar/image.png'
import railImage from '../assets/sidebar/rail.png'

const TYPE_ICONS = {
  suburb: '🏘️',
  school: '🎓',
  work:   '💼',
  club:   '⚽',
  city:   '🌆',
}

export default function RightPanel() {
  const { community, setCommunity } = useFeedStore()

  const { data: communities = [] } = useQuery({
    queryKey: ['communities'],
    queryFn: () => api.get('/communities').then((r) => r.data),
  })

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 border-l px-4 py-6 gap-4 overflow-y-auto" style={{ borderColor: 'var(--border)' }}>

      {/* Home / Popular */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wide px-2 mb-1" style={{ color: 'var(--muted-foreground)' }}>Feeds</p>
        <button
          onClick={() => setCommunity(null)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left ${
            community === null
              ? ''
              : 'hover:text-white hover:bg-white/5'
          }`}
          style={community === null
            ? { backgroundColor: 'var(--primary)', opacity: 0.1, color: 'var(--primary)' }
            : { color: 'var(--muted-foreground)' }
          }
        >
          <Globe size={16} />
          Popular
        </button>
      </div>

      <div className="h-px" style={{ backgroundColor: 'var(--border)' }} />

      {/* My Communities */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-2 mb-1">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>My Communities</p>
          <button className="text-xs hover:underline" style={{ color: 'var(--primary)' }}>+ Join</button>
        </div>

        {communities.length === 0 ? (
          <p className="text-xs px-2 py-4 text-center" style={{ color: 'var(--muted-foreground)' }}>No communities yet</p>
        ) : (
          communities.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCommunity(c.slug === community ? null : c.slug)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left group ${
                community === c.slug
                  ? ''
                  : 'hover:text-white hover:bg-white/5'
              }`}
              style={community === c.slug
                ? { backgroundColor: 'var(--primary)', opacity: 0.1, color: 'var(--primary)' }
                : { color: 'var(--muted-foreground)' }
              }
            >
              <span className="text-base w-5 text-center shrink-0">{(c.icon || TYPE_ICONS[c.type]) ?? '🌐'}</span>
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium">{c.name}</p>
              </div>
              <span className="text-xs shrink-0" style={{ color: community === c.slug ? 'var(--primary)' : 'var(--muted-foreground)', opacity: community === c.slug ? 0.7 : 1 }}>
                {c.members >= 1000 ? `${(c.members / 1000).toFixed(1)}k` : c.members || 0}
              </span>
            </button>
          ))
        )}
      </div>

      <div className="h-px" style={{ backgroundColor: 'var(--border)' }} />

      {/* Sidebar images */}
      <div className="mt-auto pt-2 flex gap-2">
        <img
          src={railImage}
          alt=""
          className="w-2/5 rounded-xl object-cover opacity-80"
          style={{ maxHeight: '160px' }}
        />
        <img
          src={sidebarImage}
          alt=""
          className="w-3/5 rounded-xl object-cover opacity-80"
          style={{ maxHeight: '160px' }}
        />
      </div>

    </aside>
  )
}
