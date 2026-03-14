import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, MessageCircle, Share2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import CategoryBadge from './CategoryBadge'

export default function DilemmaCard({ dilemma }) {
  const qc = useQueryClient()

  const vote = useMutation({
    mutationFn: (choice) => api.post(`/dilemmas/${dilemma.id}/vote`, { choice }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feed'] }),
  })

  const yesCount = dilemma.votes_yes ?? 0
  const noCount = dilemma.votes_no ?? 0
  const total = yesCount + noCount || 1
  const yesPct = Math.round((yesCount / total) * 100)

  return (
    <motion.div
      className="bg-[#1a1a1a] rounded-[1.25rem] p-5 flex flex-col gap-4 border border-[#2a2a2a] snap-start shrink-0 w-full"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center text-sm font-bold text-[#ff6b4a]">
            {dilemma.username?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-sm text-[#888]">{dilemma.username ?? 'anonymous'}</span>
        </div>
        <CategoryBadge category={dilemma.category} />
      </div>

      <p className="text-base font-medium leading-snug">{dilemma.content}</p>

      {/* Vote bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-[#888]">
          <span>Yes {yesPct}%</span>
          <span>No {100 - yesPct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#2a2a2a] overflow-hidden">
          <div
            className="h-full bg-[#ff6b4a] rounded-full transition-all duration-500"
            style={{ width: `${yesPct}%` }}
          />
        </div>
        <p className="text-xs text-[#888]">{total === 1 ? 0 : total} votes</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => vote.mutate('yes')}
          disabled={vote.isPending}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#ff6b4a]/10 text-[#ff6b4a] font-semibold text-sm hover:bg-[#ff6b4a]/20 transition-colors disabled:opacity-50"
        >
          <ThumbsUp size={16} /> Yes
        </button>
        <button
          onClick={() => vote.mutate('no')}
          disabled={vote.isPending}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-[#f0f0f0] font-semibold text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <ThumbsDown size={16} /> No
        </button>
        <button className="p-2.5 rounded-xl bg-white/5 text-[#888] hover:text-white transition-colors">
          <MessageCircle size={16} />
        </button>
        <button className="p-2.5 rounded-xl bg-white/5 text-[#888] hover:text-white transition-colors">
          <Share2 size={16} />
        </button>
      </div>

      {dilemma.outcome && (
        <div className="bg-[#ff6b4a]/10 border border-[#ff6b4a]/20 rounded-xl p-3 text-sm text-[#f0f0f0]">
          <span className="text-[#ff6b4a] font-semibold">What happened: </span>
          {dilemma.outcome}
        </div>
      )}
    </motion.div>
  )
}
