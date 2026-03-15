import { NavLink, useNavigate } from 'react-router-dom'
import { Flame, PlusCircle, Trophy, User, Zap, Sparkles, LogOut } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const links = [
  { to: '/feed', icon: Flame, label: 'Feed' },
  { to: '/post', icon: PlusCircle, label: 'Post' },
  { to: '/leaderboard', icon: Trophy, label: 'Top Voices' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function SideNav() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r px-4 py-6 gap-2" style={{ borderColor: 'var(--border)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-6">
        <Zap size={22} style={{ color: 'var(--primary)' }} fill="var(--primary)" />
        <span className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Parallel</span>
      </div>

      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'nav-link-active'
                : 'nav-link-inactive hover:text-white hover:bg-white/5'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}

      {/* AI tab — coming soon */}
      <NavLink
        to="/ai"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isActive
              ? ''
              : 'hover:text-white hover:bg-white/5'
          }`
        }
      >
        <Sparkles size={18} />
        <span className="flex-1">AI Judge</span>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border" style={{ backgroundColor: 'var(--primary)', opacity: 0.15, color: 'var(--primary)', borderColor: 'var(--primary)', borderOpacity: 0.2 }}>
          SOON
        </span>
      </NavLink>

      {/* User pill + sign out at bottom */}
      <div className="mt-auto mb-2 flex flex-col gap-1">
        {user ? (
          <>
            <div
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: 'var(--primary)', opacity: 0.2, color: 'var(--primary)' }}>
                {user.username[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{user.username}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{user.points ?? 0} pts</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium hover:text-white hover:bg-white/5 transition-colors w-full"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Sign In
          </NavLink>
        )}
      </div>
    </aside>
  )
}
