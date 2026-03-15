import { useState, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Loader2, ImagePlus, X } from 'lucide-react'

const CATEGORIES = ['personal', 'community', 'civic']

export default function Post() {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('personal')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const fileRef = useRef()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [testResult, setTestResult] = useState(null)

  const { data: communities = [] } = useQuery({
    queryKey: ['communities'],
    queryFn: () => api.get('/communities').then((r) => r.data),
  })

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
      if (selectedCommunity) fd.append('community_id', selectedCommunity)
      if (image) fd.append('image', image)
      return api.post('/dilemmas', fd)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] })
      navigate('/feed')
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
        className="border rounded-xl p-4 text-sm resize-none focus:outline-none transition-colors"
        style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
      />

      <div className="flex flex-col gap-2">
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={handleImage} />
        {preview ? (
          <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed transition-colors text-sm w-fit"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            onMouseEnter={(e) => { e.target.style.color = 'var(--foreground)'; e.target.style.borderColor = 'var(--primary)'; e.target.style.opacity = '0.5'; }}
            onMouseLeave={(e) => { e.target.style.color = 'var(--muted-foreground)'; e.target.style.borderColor = 'var(--border)'; e.target.style.opacity = '1'; }}
          >
            <ImagePlus size={16} /> Attach image
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Category</p>
        <div className="flex gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-colors ${
                category === c ? '' : 'hover:text-white border'
              }`}
              style={category === c
                ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }
                : { backgroundColor: 'var(--card)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Post to Community</p>
        <select
          value={selectedCommunity ?? ''}
          onChange={(e) => setSelectedCommunity(e.target.value ? parseInt(e.target.value) : null)}
          className="border rounded-xl p-3 text-sm focus:outline-none transition-colors appearance-none"
          style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        >
          <option value="">Global / No Community</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      {category === 'civic' && (
        <div className="rounded-xl p-4 text-sm border" style={{ backgroundColor: 'var(--primary)', opacity: 0.1, borderColor: 'var(--primary)', borderOpacity: 0.2, color: 'var(--foreground)' }}>
          🏛️ Civic dilemmas get synthesised by AI into formal recommendations for government teams.
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => testConnection.mutate()}
          disabled={testConnection.isPending}
          className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
          style={{ backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--input)'; e.target.style.color = 'var(--foreground)'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = 'var(--secondary)'; e.target.style.color = 'var(--muted-foreground)'; }}
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
        className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
        style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
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
