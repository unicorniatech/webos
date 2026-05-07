import type { BuildPlanData } from '../types'

const PRIORITY_STYLE = {
  high: 'text-red-400 bg-red-400/8 border-red-400/20',
  medium: 'text-yellow-400 bg-yellow-400/8 border-yellow-400/20',
  low: 'text-green-400 bg-green-400/8 border-green-400/20',
}

export function BuildPlan({ data }: { data: BuildPlanData }) {
  return (
    <div className="space-y-4 animate-fade-up">
      {/* Stack */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-accent uppercase tracking-widest">Tech Stack</h3>
          <span className="text-xs text-white/30 font-medium">{data.conceptName}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.stack.map(s => (
            <span key={s} className="px-3 py-1 text-xs bg-accent/8 border border-accent/20 text-accent/80 rounded-full font-mono">
              {s}
            </span>
          ))}
        </div>
        <p className="text-xs text-white/30">Estimated: {data.estimatedTime}</p>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest px-1">Sections Plan</h3>
        {data.sections.map((s, i) => (
          <div key={s.name} className="bg-surface-card border border-surface-border rounded-xl p-4">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-white/20 font-mono text-xs tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-medium text-white text-sm">{s.name}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${PRIORITY_STYLE[s.priority]}`}>
                {s.priority}
              </span>
            </div>
            <p className="text-xs text-white/40 mb-2 ml-6">{s.description}</p>
            <div className="flex flex-wrap gap-1.5 ml-6">
              {s.components.map(c => (
                <span key={c} className="text-[10px] px-1.5 py-0.5 bg-white/4 text-white/35 rounded font-mono border border-white/5">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Checklist */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-semibold text-gold uppercase tracking-widest">Implementation Checklist</h3>
        <div className="space-y-1.5">
          {data.checklist.map((item, i) => {
            const done = item.startsWith('✓')
            return (
              <div key={i} className={`flex items-start gap-2 text-sm ${done ? 'text-white/40' : 'text-white/65'}`}>
                <span className={done ? 'text-green-400 shrink-0' : 'text-white/20 shrink-0'}>
                  {done ? '✓' : '○'}
                </span>
                <span className={done ? 'line-through' : ''}>{item.replace(/^[✓○]\s*/, '')}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
