import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, ThumbsDown, MessageCircle, Send, Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import CategoryBadge from './CategoryBadge'
import { useAuthStore } from '../stores/authStore'

export default function DilemmaCard({ dilemma }) {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const [showComments, setShowComments] = useState(false)
  const [draft, setDraft] = useState('')

  const vote = useMutation({
    mutationFn: (choice) => api.post(`/dilemmas/${dilemma.id}/vote`, { choice }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feed'] }),
  })

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', dilemma.id],
    queryFn: () => api.get(`/dilemmas/${dilemma.id}/comments`).then((r) => r.data),
    enabled: showComments,
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
      className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card body */}
      <div className="p-6 flex flex-col gap-5">
        {/* Author row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center font-bold text-[#ff6b4a]">
              {dilemma.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="text-sm font-semibold">{dilemma.username ?? 'anonymous'}</p>
              <p className="text-xs text-[#888]">
                {new Date(dilemma.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
          <CategoryBadge category={dilemma.category} />
        </div>

        {/* Dilemma text */}
        <p className="text-[1.05rem] leading-relaxed font-medium">{dilemma.content}</p>

        {/* Vote bar */}
        <div className="flex flex-col gap-2">
          <div className="h-2 rounded-full bg-[#2a2a2a] overflow-hidden">
            <div
              className="h-full bg-[#ff6b4a] rounded-full transition-all duration-500"
              style={{ width: `${yesPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#888]">
            <span className="text-[#ff6b4a] font-medium">Yes {yesPct}%</span>
            <span>{total === 1 ? 0 : total} votes</span>
            <span>No {100 - yesPct}%</span>
          </div>
        </div>

        {/* Vote + comment actions */}
        <div className="flex gap-3">
          <button
            onClick={() => vote.mutate('yes')}
            disabled={vote.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#ff6b4a]/10 text-[#ff6b4a] font-semibold hover:bg-[#ff6b4a]/20 transition-colors disabled:opacity-50"
          >
            <ThumbsUp size={17} /> Yes
          </button>
          <button
            onClick={() => vote.mutate('no')}
            disabled={vote.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-[#f0f0f0] font-semibold hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <ThumbsDown size={17} /> No
          </button>
          <button
            onClick={() => setShowComments((v) => !v)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
              showComments ? 'bg-white/10 text-white' : 'bg-white/5 text-[#888] hover:text-white'
            }`}
          >
            <MessageCircle size={17} />
            <span>{comments.length || ''}</span>
          </button>
        </div>

        {/* Outcome */}
        {dilemma.outcome && (
          <div className="bg-[#ff6b4a]/10 border border-[#ff6b4a]/20 rounded-xl p-4 text-sm">
            <span className="text-[#ff6b4a] font-semibold">What happened: </span>
            {dilemma.outcome}
          </div>
        )}
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[#2a2a2a]"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {/* Comment list */}
              {commentsLoading && (
                <div className="flex justify-center py-4">
                  <Loader2 size={18} className="animate-spin text-[#ff6b4a]" />
                </div>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center text-xs font-bold text-[#ff6b4a] shrink-0 mt-0.5">
                    {c.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold">{c.username} </span>
                    <span className="text-sm text-[#ccc]">{c.content}</span>
                  </div>
                </div>
              ))}
              {!commentsLoading && comments.length === 0 && (
                <p className="text-sm text-[#888] text-center py-2">No comments yet.</p>
              )}

              {/* Input */}
              {user ? (
                <div className="flex gap-2 pt-1">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && draft.trim() && postComment.mutate()}
                    placeholder="Add a comment…"
                    className="flex-1 bg-[#242424] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff6b4a] transition-colors placeholder-[#555]"
                  />
                  <button
                    onClick={() => postComment.mutate()}
                    disabled={!draft.trim() || postComment.isPending}
                    className="p-2.5 rounded-xl bg-[#ff6b4a] text-white disabled:opacity-40 hover:bg-[#cc5239] transition-colors"
                  >
                    {postComment.isPending
                      ? <Loader2 size={16} className="animate-spin" />
                      : <Send size={16} />
                    }
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[#888] text-center pb-1">Sign in to comment.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
