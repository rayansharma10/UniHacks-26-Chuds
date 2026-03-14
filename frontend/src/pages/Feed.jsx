import { useQuery } from '@tanstack/react-query'
import { useFeedStore } from '../stores/feedStore'
import api from '../lib/api'
import DilemmaCard from '../components/DilemmaCard'
import { Loader2 } from 'lucide-react'

const CATEGORIES = ['all', 'personal', 'community', 'civic']

export default function Feed() {
  const { category, setCategory } = useFeedStore()

  const { data, isLoading } = useQuery({
    queryKey: ['feed', category],
    queryFn: () =>
      api.get('/dilemmas', { params: category !== 'all' ? { category } : {} }).then((r) => r.data),
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-[#0f0f0f] sticky top-0 z-10 border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">Feed</h1>
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
      <div className="flex-1 overflow-y-auto px-6 pb-20 md:pb-8 flex flex-col gap-4 pt-6">
        {isLoading && (
          <div className="flex justify-center pt-16">
            <Loader2 className="animate-spin text-[#ff6b4a]" size={28} />
          </div>
        )}
        {data?.map((d) => <DilemmaCard key={d.id} dilemma={d} />)}
        {!isLoading && !data?.length && (
          <p className="text-center text-[#888] pt-16">No dilemmas yet. Be the first!</p>
        )}
      </div>
    </div>
  )
}
