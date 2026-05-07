import type { DeploymentGuideData } from '../types'

export function DeploymentGuide({ data }: { data: DeploymentGuideData }) {
  return (
    <div className="space-y-4 animate-fade-up">
      {/* Steps */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-semibold text-accent uppercase tracking-widest">Deploy Steps</h3>
        <div className="space-y-4">
          {data.steps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 space-y-1.5">
                <p className="text-sm font-medium text-white">{step.title}</p>
                {step.command && (
                  <code className="block text-xs font-mono bg-black/50 text-electric rounded-lg px-3 py-2 border border-white/5">
                    $ {step.command}
                  </code>
                )}
                <p className="text-xs text-white/40">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-semibold text-electric uppercase tracking-widest">Supported Platforms</h3>
        <div className="flex flex-wrap gap-2">
          {data.platforms.map((p, i) => (
            <span
              key={p}
              className={`px-3 py-1 text-xs rounded-full border ${
                i === 0
                  ? 'bg-electric/10 border-electric/25 text-electric'
                  : 'bg-white/4 border-white/10 text-white/45'
              }`}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Env vars */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-semibold text-gold uppercase tracking-widest">Environment Variables</h3>
        <div className="bg-black/30 rounded-lg p-3 border border-white/5 space-y-1.5">
          {data.envVars.map(v => (
            <p key={v} className="text-xs font-mono text-gold/60">
              {v}=<span className="text-white/20">your_value_here</span>
            </p>
          ))}
        </div>
        <p className="text-xs text-white/30">Copy to <code className="text-white/50">.env.local</code> and fill in your values.</p>
      </div>

      {/* Notes */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-4">
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-2">Notes</h3>
        <p className="text-sm text-white/50 leading-relaxed">{data.notes}</p>
      </div>
    </div>
  )
}
