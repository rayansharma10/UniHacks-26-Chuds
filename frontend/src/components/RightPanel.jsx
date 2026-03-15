import { useQuery } from '@tanstack/react-query'
import { useFeedStore } from '../stores/feedStore'
import api from '../lib/api'
import { Globe } from 'lucide-react'
import sidebarImage from '../assets/sidebar/image.png'

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
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-screen sticky top-0 border-l border-[#2a2a2a] px-4 py-6 gap-4 overflow-y-auto">

      {/* Home / Popular */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold text-[#555] uppercase tracking-wide px-2 mb-1">Feeds</p>
        <button
          onClick={() => setCommunity(null)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left ${
            community === null
              ? 'bg-[#ff6b4a]/10 text-[#ff6b4a]'
              : 'text-[#888] hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe size={16} />
          Popular
        </button>
      </div>

      <div className="h-px bg-[#2a2a2a]" />

      {/* My Communities */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-2 mb-1">
          <p className="text-xs font-semibold text-[#555] uppercase tracking-wide">Communities (Coming soon!)</p>
          <button className="text-xs text-[#ff6b4a] hover:underline">+ Join</button>
        </div>

        {communities.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCommunity(c.slug === community ? null : c.slug)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left group ${
              community === c.slug
                ? 'bg-[#ff6b4a]/10 text-[#ff6b4a]'
                : 'text-[#888] hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-base w-5 text-center shrink-0">{TYPE_ICONS[c.type] ?? '🌐'}</span>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium">{c.name}</p>
            </div>
            <span className={`text-xs shrink-0 ${community === c.slug ? 'text-[#ff6b4a]/70' : 'text-[#555]'}`}>
              {c.members >= 1000 ? `${(c.members / 1000).toFixed(1)}k` : c.members}
            </span>
          </button>
        ))}
      </div>

      <div className="h-px bg-[#2a2a2a]" />

      {/* Sidebar images */}
      <div className="mt-auto pt-2">
        <img
          src={sidebarImage}
          alt=""
          className="w-full rounded-xl object-cover opacity-80"
          style={{ maxHeight: '180px' }}
        />
      </div>

    </aside>
  )
}
