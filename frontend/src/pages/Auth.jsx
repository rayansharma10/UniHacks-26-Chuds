import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { login, register } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.username, form.password)
      } else {
        await register(form.username, form.email, form.password)
        await login(form.username, form.password)
      }
      const from = location.state?.from?.pathname ?? '/feed'
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>Parallel</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Community Decision Intelligence</p>
      </div>

      <form onSubmit={submit} className="w-full max-w-sm flex flex-col gap-4">
        <input
          value={form.username}
          onChange={set('username')}
          placeholder="Username"
          required
          className="border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
        {mode === 'register' && (
          <input
            value={form.email}
            onChange={set('email')}
            placeholder="Email"
            type="email"
            required
            className="border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        )}
        <input
          value={form.password}
          onChange={set('password')}
          placeholder="Password"
          type="password"
          required
          className="border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="text-sm hover:text-white transition-colors text-center"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}
