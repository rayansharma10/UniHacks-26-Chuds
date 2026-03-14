import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Loader2, ImagePlus, X } from 'lucide-react'

const CATEGORIES = ['personal', 'community', 'civic']

export default function Post() {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('personal')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()
  const navigate = useNavigate()
  const [testResult, setTestResult] = useState(null)

  const testConnection = useMutation({
    mutationFn: () => api.get('/dilemmas/test-connection'),
    onSuccess: (data) => setTestResult(data.data),
    onError: (error) => setTestResult({ success: false, error: error.message })
  })

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImage(null)
    setPreview(null)
    fileRef.current.value = ''
  }

  const post = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      fd.append('content', content)
      fd.append('category', category)
      if (image) fd.append('image', image)
      return api.post('/dilemmas', fd)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] })
      navigate('/')
    },
  })

  return (
    <div className="px-8 pt-8 pb-20 md:pb-8 flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">Post a Dilemma</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's your dilemma? Be specific — the community will vote on it."
        rows={6}
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-sm text-[#f0f0f0] placeholder-[#555] resize-none focus:outline-none focus:border-[#ff6b4a] transition-colors"
      />

      <div className="flex flex-col gap-2">
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={handleImage} />
        {preview ? (
          <div className="relative rounded-xl overflow-hidden border border-[#2a2a2a]">
            <img src={preview} alt="preview" className="w-full max-h-64 object-cover" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#2a2a2a] text-[#555] hover:text-white hover:border-[#ff6b4a]/50 transition-colors text-sm w-fit"
          >
            <ImagePlus size={16} /> Attach image
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#888] font-medium">Category</p>
        <div className="flex gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
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
        <div className="bg-[#ff6b4a]/10 border border-[#ff6b4a]/20 rounded-xl p-4 text-sm text-[#f0f0f0]">
          🏛️ Civic dilemmas get synthesised by AI into formal recommendations for government teams.
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => testConnection.mutate()}
          disabled={testConnection.isPending}
          className="flex-1 py-3 rounded-xl bg-[#2a2a2a] text-[#888] font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity hover:bg-[#3a3a3a] hover:text-white"
        >
          {testConnection.isPending && <Loader2 size={16} className="animate-spin" />}
          Test R2 Connection
        </button>
      </div>

      {testResult && (
        <div className={`p-3 rounded-xl text-sm ${testResult.success ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
          <div className="font-semibold">{testResult.success ? '✅ Connection Successful' : '❌ Connection Failed'}</div>
          {testResult.buckets && <div>Buckets: {testResult.buckets.join(', ')}</div>}
          {testResult.error && <div>Error: {testResult.error}</div>}
        </div>
      )}

      <button
        onClick={() => post.mutate()}
        disabled={!content.trim() || post.isPending}
        className="py-3 rounded-xl bg-[#ff6b4a] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity hover:bg-[#cc5239]"
      >
        {post.isPending && <Loader2 size={16} className="animate-spin" />}
        Post Dilemma
      </button>

      {post.isError && (
        <p className="text-red-400 text-sm text-center">
          Failed to post: {post.error?.response?.data?.detail || post.error?.message || 'Unknown error'}. Are you logged in?
        </p>
      )}
    </div>
  )
}
