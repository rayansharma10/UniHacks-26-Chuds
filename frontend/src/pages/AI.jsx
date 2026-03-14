import { Sparkles } from 'lucide-react'

export default function AI() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full gap-5 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#ff6b4a]/10 border border-[#ff6b4a]/20 flex items-center justify-center">
        <Sparkles size={28} className="text-[#ff6b4a]" />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">AI Judge</h2>
        <p className="text-[#888] text-sm max-w-xs leading-relaxed">
          The AI layer is coming soon. It will score your votes, synthesise civic dilemmas into formal recommendations, and tell you how your reasoning stacks up.
        </p>
      </div>
      <span className="px-3 py-1 rounded-full bg-[#ff6b4a]/10 text-[#ff6b4a] text-xs font-semibold border border-[#ff6b4a]/20">
        Coming Soon
      </span>
    </div>
  )
}
