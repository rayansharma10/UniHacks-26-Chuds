import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Loader2 } from 'lucide-react'

const CATEGORIES = ['personal', 'community', 'civic']

export default function Post() {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('personal')
  const navigate = useNavigate()
  const qc = useQueryClient()

  const post = useMutation({
    mutationFn: () => api.post('/dilemmas', { content, category }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] })
      navigate('/')
    },
  })

  return (
    <div className="flex flex-col px-4 pt-12 pb-24 gap-6">
      <h2 className="text-xl font-bold">Post a Dilemma</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's your dilemma? Be specific — the community will vote on it."
        rows={5}
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-sm text-[#f0f0f0] placeholder-[#555] resize-none focus:outline-none focus:border-[#ff6b4a] transition-colors"
      />

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#888] font-medium">Category</p>
        <div className="flex gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
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

      {category === 'civic' && (
        <div className="bg-[#ff6b4a]/10 border border-[#ff6b4a]/20 rounded-xl p-3 text-sm text-[#f0f0f0]">
          🏛️ Civic dilemmas get synthesised by AI into formal recommendations for government teams.
        </div>
      )}

      <button
        onClick={() => post.mutate()}
        disabled={!content.trim() || post.isPending}
        className="py-3 rounded-xl bg-[#ff6b4a] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
      >
        {post.isPending && <Loader2 size={16} className="animate-spin" />}
        Post Dilemma
      </button>

      {post.isError && (
        <p className="text-red-400 text-sm text-center">Failed to post. Are you logged in?</p>
      )}
    </div>
  )
}
