import type { WebsiteAnalysis } from '../types'

function Tag({ children }: { children: string }) {
  return (
    <span className="px-2 py-0.5 text-xs bg-white/5 border border-white/10 rounded-full text-white/55">
      {children}
    </span>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-white/30 text-xs w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-white/75 text-sm">{value}</span>
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-card border border-surface-border rounded-xl p-5 space-y-3 ${className}`}>
      {children}
    </div>
  )
}

function SectionLabel({ color, children }: { color: string; children: string }) {
  return (
    <h3 className={`text-xs font-semibold uppercase tracking-widest ${color}`}>{children}</h3>
  )
}

export function BrandAnalysisCard({ data }: { data: WebsiteAnalysis }) {
  return (
    <div className="space-y-4 animate-fade-up">
      {/* Brand Identity */}
      <Card>
        <SectionLabel color="text-accent">Brand Identity</SectionLabel>
        <div className="space-y-2">
          <Row label="Business" value={data.brand.businessName} />
          <Row label="Industry" value={data.brand.industry} />
          <Row label="Offer" value={data.brand.offer} />
          <Row label="Audience" value={data.brand.targetAudience} />
          <Row label="Personality" value={data.brand.personality} />
          <Row label="Tone" value={data.brand.emotionalTone} />
        </div>
        <div className="pt-1 space-y-1.5">
          <p className="text-xs text-white/25">Trust signals</p>
          <div className="flex flex-wrap gap-1.5">
            {data.brand.trustSignals.map(t => <Tag key={t}>{t}</Tag>)}
          </div>
        </div>
        <div className="pt-1 space-y-1.5">
          <p className="text-xs text-white/25">Differentiators</p>
          <div className="flex flex-wrap gap-1.5">
            {data.brand.differentiators.map(d => <Tag key={d}>{d}</Tag>)}
          </div>
        </div>
      </Card>

      {/* Visual Identity */}
      <Card>
        <SectionLabel color="text-electric">Visual Identity</SectionLabel>
        <div className="flex gap-2.5 flex-wrap">
          {[
            { label: 'Primary', color: data.visual.primaryColor },
            { label: 'Secondary', color: data.visual.secondaryColor },
            { label: 'Accent', color: data.visual.accentColor },
            { label: 'Background', color: data.visual.backgroundColor },
          ].map(({ label, color }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-lg border border-white/10" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-mono text-white/30">{color}</span>
              <span className="text-[10px] text-white/20">{label}</span>
            </div>
          ))}
        </div>
        <Row label="Typography" value={data.visual.typographyStyle} />
        <Row label="Image style" value={data.visual.imageStyle} />
        <Row label="Radius" value={data.visual.borderRadius} />
        <Row label="Motion" value={data.visual.motionStyle} />
      </Card>

      {/* Content Structure */}
      <Card>
        <SectionLabel color="text-gold">Content Structure</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {data.sections.map((s, i) => (
            <div key={s} className="flex items-center gap-2 text-sm text-white/60">
              <span className="text-white/20 text-xs font-mono tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              {s}
            </div>
          ))}
        </div>
        <div className="flex gap-4 pt-1">
          <div>
            <p className="text-[10px] text-white/25 mb-1">Main CTA</p>
            <span className="text-xs px-2.5 py-1 bg-accent/15 border border-accent/25 text-accent rounded-lg">{data.mainCTA}</span>
          </div>
          <div>
            <p className="text-[10px] text-white/25 mb-1">Secondary CTA</p>
            <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-white/50 rounded-lg">{data.secondaryCTA}</span>
          </div>
        </div>
      </Card>

      {/* UX Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <SectionLabel color="text-red-400">Friction Points</SectionLabel>
          <ul className="space-y-1.5">
            {data.frictionPoints.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/55">
                <span className="text-red-400/80 mt-0.5 shrink-0">✕</span>{f}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <SectionLabel color="text-green-400">Opportunities</SectionLabel>
          <ul className="space-y-1.5">
            {data.opportunities.map(o => (
              <li key={o} className="flex items-start gap-2 text-sm text-white/55">
                <span className="text-green-400/80 mt-0.5 shrink-0">✓</span>{o}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
