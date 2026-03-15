import { useState } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, Send, Loader2, Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import CategoryBadge from './CategoryBadge'
import { useAuthStore } from '../stores/authStore'

export default function DilemmaCard({ dilemma }) {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const [draft, setDraft] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isOwner = user?.id === dilemma.user_id
  const isAdmin = user?.is_admin
  const canDelete = isOwner || isAdmin

  const deleteDilemma = useMutation({
    mutationFn: () => api.delete(`/dilemmas/${dilemma.id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] })
      qc.invalidateQueries({ queryKey: ['my-dilemmas'] })
    },
  })

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
  const myVote = vote.data?.data?.dilemma?.user_vote ?? dilemma.user_vote

  return (
    <motion.div
      className="rounded-2xl border overflow-hidden flex flex-col md:flex-row md:min-h-[480px]"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── LEFT: dilemma + voting ── */}
      <div className="flex-1 p-8 flex flex-col gap-6 min-w-0">
        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg shrink-0" style={{ backgroundColor: 'var(--primary)', opacity: 0.2, color: 'var(--primary)' }}>
              {dilemma.username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-semibold">{dilemma.username ?? 'anonymous'}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {new Date(dilemma.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CategoryBadge category={dilemma.category} />
            {canDelete && (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Delete?</span>
                  <button
                    onClick={() => deleteDilemma.mutate()}
                    disabled={deleteDilemma.isPending}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs transition-colors" style={{ color: 'var(--muted-foreground)' }}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-1.5 rounded-lg hover:text-red-400 hover:bg-red-400/10 transition-colors" style={{ color: 'var(--muted-foreground)' }}
                >
                  <Trash2 size={14} />
                </button>
              )
            )}
          </div>
        </div>

        {/* Dilemma text */}
        <p className="text-xl leading-relaxed font-medium flex-1">{dilemma.content}</p>

        {/* Image */}
        {dilemma.image_url && (
          <img
            src={dilemma.image_url}
            alt="dilemma"
            className="w-full max-h-72 object-cover rounded-xl border" style={{ borderColor: 'var(--border)' }}
          />
        )}

        {/* Vote bar */}
        <div className="flex flex-col gap-2">
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${yesPct}%`, backgroundColor: 'var(--primary)' }}
            />
          </div>
          <div className="flex justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <span className="font-medium" style={{ color: 'var(--primary)' }}>Yes {yesPct}%</span>
            <span>{total === 1 ? 0 : total} votes</span>
            <span>No {100 - yesPct}%</span>
          </div>
        </div>

        {/* Vote buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => vote.mutate('yes')}
            disabled={vote.isPending}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-colors disabled:opacity-50 ${
              myVote === 'yes'
                ? 'ring-2'
                : ''
            }`}
            style={myVote === 'yes'
              ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', ringColor: 'var(--primary)', opacity: 0.5 }
              : { backgroundColor: 'var(--primary)', opacity: 0.1, color: 'var(--primary)' }
            }
          >
            <ThumbsUp size={18} fill={myVote === 'yes' ? 'currentColor' : 'none'} /> Yes
          </button>
          <button
            onClick={() => vote.mutate('no')}
            disabled={vote.isPending}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-colors disabled:opacity-50 ${
              myVote === 'no'
                ? 'ring-2'
                : ''
            }`}
            style={myVote === 'no'
              ? { backgroundColor: 'var(--secondary)', opacity: 0.2, color: 'var(--foreground)', ringColor: 'var(--border)' }
              : { backgroundColor: 'var(--secondary)', opacity: 0.05, color: 'var(--foreground)' }
            }
          >
            <ThumbsDown size={18} fill={myVote === 'no' ? 'currentColor' : 'none'} /> No
          </button>
        </div>

        {/* Outcome */}
        {dilemma.outcome && (
          <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--primary)', opacity: 0.1, borderColor: 'var(--primary)', borderOpacity: 0.2 }}>
            <span className="font-semibold" style={{ color: 'var(--primary)' }}>What happened: </span>
            <span className="text-sm">{dilemma.outcome}</span>
          </div>
        )}
      </div>

      {/* ── DIVIDER ── */}
      <div className="hidden md:block w-px self-stretch" style={{ backgroundColor: 'var(--border)' }} />
      <div className="md:hidden h-px mx-8" style={{ backgroundColor: 'var(--border)' }} />

      {/* ── RIGHT: comments ── */}
      <div className="w-full md:w-96 shrink-0 flex flex-col p-6 gap-4">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
          Comments {comments.length > 0 && `· ${comments.length}`}
        </p>

        {/* Scrollable comment list */}
        <div className="overflow-y-auto flex flex-col gap-4 pr-1" style={{ height: '340px' }}>
          {commentsLoading && (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin" style={{ color: 'var(--primary)' }} />
            </div>
          )}
          {!commentsLoading && comments.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: 'var(--muted-foreground)' }}>No comments yet.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5" style={{ backgroundColor: 'var(--primary)', opacity: 0.2, color: 'var(--primary)' }}>
                {c.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{c.username} </span>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{c.content}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comment input */}
        {user ? (
          <div className="flex gap-2 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && draft.trim() && postComment.mutate()}
              placeholder="Add a comment…"
              className="flex-1 min-w-0 border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={() => postComment.mutate()}
              disabled={!draft.trim() || postComment.isPending}
              className="p-2.5 rounded-xl disabled:opacity-40 transition-colors shrink-0"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              {postComment.isPending
                ? <Loader2 size={16} className="animate-spin" />
                : <Send size={16} />
              }
            </button>
          </div>
        ) : (
          <p className="text-xs text-center pt-3 border-t" style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
            Sign in to comment.
          </p>
        )}
      </div>
    </motion.div>
  )
}
