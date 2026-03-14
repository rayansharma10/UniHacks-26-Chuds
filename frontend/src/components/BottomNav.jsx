import { NavLink } from 'react-router-dom'
import { Flame, PlusCircle, Trophy, User } from 'lucide-react'

const links = [
  { to: '/', icon: Flame, label: 'Feed' },
  { to: '/post', icon: PlusCircle, label: 'Post' },
  { to: '/leaderboard', icon: Trophy, label: 'Top' },
  { to: '/profile', icon: User, label: 'Me' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2a2a2a] flex justify-around items-center h-16 z-50">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs transition-colors ${isActive ? 'text-[#ff6b4a]' : 'text-[#888] hover:text-white'}`
          }
        >
          <Icon size={22} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
