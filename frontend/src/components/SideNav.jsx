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
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-[#2a2a2a] px-4 py-6 gap-2">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-6">
        <Zap size={22} className="text-[#ff6b4a]" fill="#ff6b4a" />
        <span className="text-xl font-bold text-[#ff6b4a]">Parallel</span>
      </div>

      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[#ff6b4a]/10 text-[#ff6b4a]'
                : 'text-[#888] hover:text-white hover:bg-white/5'
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
              ? 'bg-[#ff6b4a]/10 text-[#ff6b4a]'
              : 'text-[#888] hover:text-white hover:bg-white/5'
          }`
        }
      >
        <Sparkles size={18} />
        <span className="flex-1">AI Judge</span>
        <span className="text-[10px] font-semibold bg-[#ff6b4a]/15 text-[#ff6b4a] px-1.5 py-0.5 rounded-full border border-[#ff6b4a]/20">
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
              <div className="w-8 h-8 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center font-bold text-[#ff6b4a] text-sm shrink-0">
                {user.username[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{user.username}</p>
                <p className="text-xs text-[#888]">{user.points ?? 0} pts</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-[#888] hover:text-white hover:bg-white/5 transition-colors w-full"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-[#ff6b4a] text-white text-sm font-semibold hover:bg-[#cc5239] transition-colors"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </aside>
  )
}
