const COLORS = {
  personal: 'bg-purple-500/20 text-purple-300',
  community: 'bg-blue-500/20 text-blue-300',
  civic: 'bg-coral/20 text-coral',
}

export default function CategoryBadge({ category }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${COLORS[category] || 'bg-white/10 text-white/60'}`}>
      {category}
    </span>
  )
}
