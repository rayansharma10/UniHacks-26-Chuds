import { Sparkles } from 'lucide-react'

export default function AI() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full gap-5 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl border flex items-center justify-center" style={{ backgroundColor: 'var(--primary)', opacity: 0.1, borderColor: 'var(--primary)', borderOpacity: 0.2 }}>
        <Sparkles size={28} style={{ color: 'var(--primary)' }} />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">AI Judge</h2>
        <p className="text-sm max-w-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          The AI layer is coming soon. It will score your votes, synthesise civic dilemmas into formal recommendations, and tell you how your reasoning stacks up.
        </p>
      </div>
      <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'var(--primary)', opacity: 0.1, color: 'var(--primary)', borderColor: 'var(--primary)', borderOpacity: 0.2 }}>
        Coming Soon
      </span>
    </div>
  )
}
