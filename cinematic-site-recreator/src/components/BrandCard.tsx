import type { BrandCardData } from '../types'

export function BrandCard({ data }: { data: BrandCardData }) {
  return (
    <div className="space-y-4 animate-fade-up">
      {/* Summary */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-semibold text-accent uppercase tracking-widest">Brand Summary</h3>
        <p className="text-white/75 text-sm leading-relaxed">{data.summary}</p>
        <div className="border-l-2 border-accent/30 pl-3">
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Positioning Statement</p>
          <p className="text-white/80 text-sm italic">"{data.positioning}"</p>
        </div>
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Tone of Voice</p>
          <p className="text-white/60 text-sm">{data.toneOfVoice}</p>
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-semibold text-electric uppercase tracking-widest">Color Palette</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.colors.map(c => (
            <div key={c.name} className="space-y-1.5">
              <div
                className="h-10 rounded-lg border border-white/10"
                style={{ backgroundColor: c.hex }}
              />
              <div>
                <p className="text-xs font-medium text-white/75">{c.name}</p>
                <p className="text-[10px] font-mono text-white/35">{c.hex}</p>
                <p className="text-[10px] text-white/25 leading-tight">{c.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-semibold text-gold uppercase tracking-widest">Typography System</h3>
        <div className="space-y-2">
          {Object.entries(data.typography).map(([key, val]) => (
            <div key={key} className="flex gap-3">
              <span className="text-white/30 text-xs w-14 shrink-0 pt-0.5 capitalize">{key}</span>
              <span className="text-white/70 text-sm">{val}</span>
            </div>
          ))}
        </div>
        <div>
          <p className="text-white/25 text-[10px] uppercase tracking-widest mb-1">UI Direction</p>
          <p className="text-white/55 text-sm">{data.uiDirection}</p>
        </div>
      </div>

      {/* Headlines & CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Hero Headlines</h3>
          <ul className="space-y-2">
            {data.heroHeadlines.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/65">
                <span className="text-accent mt-0.5 shrink-0">▸</span>{h}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-semibold text-pink-400 uppercase tracking-widest">Taglines</h3>
          <div className="space-y-1.5">
            {data.taglines.map((t, i) => (
              <p key={i} className="text-sm text-white/65 italic">"{t}"</p>
            ))}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-2">CTA Options</h4>
            <div className="flex flex-wrap gap-1.5">
              {data.ctas.map(cta => (
                <span key={cta} className="px-2.5 py-1 text-xs bg-accent/10 border border-accent/25 text-accent rounded-lg">
                  {cta}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Motion */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5">
        <h3 className="text-xs font-semibold text-electric uppercase tracking-widest mb-2">Motion Direction</h3>
        <p className="text-white/65 text-sm leading-relaxed">{data.motionDirection}</p>
      </div>
    </div>
  )
}
