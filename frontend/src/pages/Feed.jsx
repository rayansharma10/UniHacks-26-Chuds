import { useQuery } from '@tanstack/react-query'
import { useFeedStore } from '../stores/feedStore'
import api from '../lib/api'
import DilemmaCard from '../components/DilemmaCard'
import { Loader2, X } from 'lucide-react'

const CATEGORIES = ['all', 'personal', 'community', 'civic']

export default function Feed() {
  const { category, setCategory, community, setCommunity } = useFeedStore()

  const { data: communities = [] } = useQuery({
    queryKey: ['communities'],
    queryFn: () => api.get('/communities').then((r) => r.data),
  })

  const activeCommunity = communities.find((c) => c.slug === community)

  const { data, isLoading } = useQuery({
    queryKey: ['feed', category, community],
    queryFn: () => {
      const params = {}
      if (category !== 'all') params.category = category
      if (community) params.community = community
      return api.get('/dilemmas', { params }).then((r) => r.data)
    },
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-[#0f0f0f] sticky top-0 z-10 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-4">
          {activeCommunity ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeCommunity.icon ?? '🌐'}</span>
              <h1 className="text-lg font-bold">{activeCommunity.name}</h1>
              <button
                onClick={() => setCommunity(null)}
                className="ml-1 p-1 rounded-lg text-[#888] hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <h1 className="text-lg font-bold">Popular</h1>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                category === c
                  ? 'bg-[#ff6b4a] text-white'
                  : 'bg-[#1a1a1a] text-[#888] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 md:pb-8 flex flex-col gap-6 pt-6">
        {isLoading && (
          <div className="flex justify-center pt-16">
            <Loader2 className="animate-spin text-[#ff6b4a]" size={28} />
          </div>
        )}
        {data?.map((d) => <DilemmaCard key={d.id} dilemma={d} />)}
        {!isLoading && !data?.length && (
          <p className="text-center text-[#888] pt-16">No dilemmas here yet.</p>
        )}
      </div>
    </div>
  )
}
