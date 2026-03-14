import { useState } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, Send, Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import CategoryBadge from './CategoryBadge'
import { useAuthStore } from '../stores/authStore'

export default function DilemmaCard({ dilemma }) {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const [draft, setDraft] = useState('')

  const vote = useMutation({
    mutationFn: (choice) => api.post(`/dilemmas/${dilemma.id}/vote`, { choice }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feed'] }),
  })

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', dilemma.id],
    queryFn: () => api.get(`/dilemmas/${dilemma.id}/comments`).then((r) => r.data),
  })

  const postComment = useMutation({
    mutationFn: () => api.post(`/dilemmas/${dilemma.id}/comments`, { content: draft }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', dilemma.id] })
      setDraft('')
    },
  })

  const yesCount = dilemma.votes_yes ?? 0
  const noCount = dilemma.votes_no ?? 0
  const total = yesCount + noCount || 1
  const yesPct = Math.round((yesCount / total) * 100)

  return (
    <motion.div
      className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden flex flex-col md:flex-row md:min-h-[480px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── LEFT: dilemma + voting ── */}
      <div className="flex-1 p-8 flex flex-col gap-6 min-w-0">
        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center font-bold text-[#ff6b4a] text-lg shrink-0">
              {dilemma.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-semibold">{dilemma.username ?? 'anonymous'}</p>
              <p className="text-xs text-[#888]">
                {new Date(dilemma.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
          <CategoryBadge category={dilemma.category} />
        </div>

        {/* Dilemma text */}
        <p className="text-xl leading-relaxed font-medium flex-1">{dilemma.content}</p>

        {/* Vote bar */}
        <div className="flex flex-col gap-2">
          <div className="h-2.5 rounded-full bg-[#2a2a2a] overflow-hidden">
            <div
              className="h-full bg-[#ff6b4a] rounded-full transition-all duration-500"
              style={{ width: `${yesPct}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-[#888]">
            <span className="text-[#ff6b4a] font-medium">Yes {yesPct}%</span>
            <span>{total === 1 ? 0 : total} votes</span>
            <span>No {100 - yesPct}%</span>
          </div>
        </div>

        {/* Vote buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => vote.mutate('yes')}
            disabled={vote.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#ff6b4a]/10 text-[#ff6b4a] font-semibold text-base hover:bg-[#ff6b4a]/20 transition-colors disabled:opacity-50"
          >
            <ThumbsUp size={18} /> Yes
          </button>
          <button
            onClick={() => vote.mutate('no')}
            disabled={vote.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 text-[#f0f0f0] font-semibold text-base hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <ThumbsDown size={18} /> No
          </button>
        </div>

        {/* Outcome */}
        {dilemma.outcome && (
          <div className="bg-[#ff6b4a]/10 border border-[#ff6b4a]/20 rounded-xl p-4">
            <span className="text-[#ff6b4a] font-semibold">What happened: </span>
            <span className="text-sm">{dilemma.outcome}</span>
          </div>
        )}
      </div>

      {/* ── DIVIDER ── */}
      <div className="hidden md:block w-px bg-[#2a2a2a] self-stretch" />
      <div className="md:hidden h-px bg-[#2a2a2a] mx-8" />

      {/* ── RIGHT: comments ── */}
      <div className="w-full md:w-96 shrink-0 flex flex-col p-6 gap-4">
        <p className="text-xs font-semibold text-[#888] uppercase tracking-wide">
          Comments {comments.length > 0 && `· ${comments.length}`}
        </p>

        {/* Scrollable comment list */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 min-h-0 pr-1">
          {commentsLoading && (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-[#ff6b4a]" />
            </div>
          )}
          {!commentsLoading && comments.length === 0 && (
            <p className="text-sm text-[#555] text-center py-8">No comments yet.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center text-xs font-bold text-[#ff6b4a] shrink-0 mt-0.5">
                {c.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-[#f0f0f0]">{c.username} </span>
                <span className="text-sm text-[#aaa] leading-relaxed">{c.content}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comment input */}
        {user ? (
          <div className="flex gap-2 pt-3 border-t border-[#2a2a2a]">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && draft.trim() && postComment.mutate()}
              placeholder="Add a comment…"
              className="flex-1 min-w-0 bg-[#242424] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff6b4a] transition-colors placeholder-[#555]"
            />
            <button
              onClick={() => postComment.mutate()}
              disabled={!draft.trim() || postComment.isPending}
              className="p-2.5 rounded-xl bg-[#ff6b4a] text-white disabled:opacity-40 hover:bg-[#cc5239] transition-colors shrink-0"
            >
              {postComment.isPending
                ? <Loader2 size={16} className="animate-spin" />
                : <Send size={16} />
              }
            </button>
          </div>
        ) : (
          <p className="text-xs text-[#555] text-center pt-3 border-t border-[#2a2a2a]">
            Sign in to comment.
          </p>
        )}
      </div>
    </motion.div>
  )
}
