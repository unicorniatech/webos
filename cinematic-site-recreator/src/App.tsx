import { useState } from 'react'
import { AppShell } from './components/AppShell'
import { UrlAnalyzerForm } from './components/UrlAnalyzerForm'
import { PhaseStepper } from './components/PhaseStepper'
import { BrandAnalysisCard } from './components/BrandAnalysisCard'
import { BrandCard } from './components/BrandCard'
import { CinematicConcepts } from './components/CinematicConcepts'
import { BuildPlan } from './components/BuildPlan'
import { CopywritingMap } from './components/CopywritingMap'
import { DeploymentGuide } from './components/DeploymentGuide'
import { analyzeWebsite } from './lib/analyzer'
import type { AnalysisResult, PhaseId } from './types'

const PHASES: { id: PhaseId; label: string; icon: string }[] = [
  { id: 'brand-analysis', label: 'Brand Analysis', icon: '◈' },
  { id: 'brand-card', label: 'Brand Card', icon: '◉' },
  { id: 'cinematic-concepts', label: 'Cinematic Scenes', icon: '◎' },
  { id: 'build-plan', label: 'Build Plan', icon: '◫' },
  { id: 'copywriting', label: 'Copywriting', icon: '✦' },
  { id: 'deployment', label: 'Deployment', icon: '◬' },
]

const PHASE_ORDER: PhaseId[] = [
  'brand-analysis',
  'brand-card',
  'cinematic-concepts',
  'build-plan',
  'copywriting',
  'deployment',
]

const FEATURES = [
  { icon: '◈', label: 'Brand Analysis', desc: 'Identity, colors, tone of voice' },
  { icon: '◉', label: 'Brand Card', desc: 'Palette, typography, positioning' },
  { icon: '◎', label: 'Cinematic Scenes', desc: '3 hero concept designs' },
  { icon: '◫', label: 'Build Plan', desc: 'Sections, components, stack' },
  { icon: '✦', label: 'Copywriting Map', desc: 'Improved commercial copy' },
  { icon: '◬', label: 'Deploy Guide', desc: 'Vercel-ready in minutes' },
]

export default function App() {
  const [phase, setPhase] = useState<PhaseId>('idle')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState<PhaseId>('brand-analysis')
  const [error, setError] = useState('')
  const [analyzedUrl, setAnalyzedUrl] = useState('')

  async function handleAnalyze(url: string) {
    setPhase('analyzing')
    setError('')
    setAnalyzedUrl(url)
    try {
      const data = await analyzeWebsite(url)
      setResult(data)
      setPhase('complete')
      setActiveTab('brand-analysis')
    } catch {
      setError('Analysis failed. Please try again.')
      setPhase('idle')
    }
  }

  function handleReset() {
    setPhase('idle')
    setResult(null)
    setError('')
    setAnalyzedUrl('')
  }

  const activeTabIndex = PHASE_ORDER.indexOf(activeTab)

  return (
    <AppShell>
      {/* ── LANDING / ANALYZING STATE ── */}
      {(phase === 'idle' || phase === 'analyzing') && (
        <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-16">
          {/* Hero text */}
          <div className="text-center mb-10 space-y-4 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-medium mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              AI-Powered Website Recreator
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl leading-tight tracking-tight">
              <span className="text-gradient">Cinematic</span>
              <br />
              <span className="text-white">Site Recreator</span>
            </h1>
            <p className="text-white/35 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              Paste any website URL. Get a full brand analysis, cinematic hero concepts,
              copywriting, and a production-ready build plan.
            </p>
          </div>

          {/* Form */}
          <UrlAnalyzerForm onAnalyze={handleAnalyze} isLoading={phase === 'analyzing'} />

          {/* Analyzing state */}
          {phase === 'analyzing' && (
            <div className="mt-12 flex flex-col items-center gap-4 animate-fade-in">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-accent/15 border-t-accent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-medium">{analyzedUrl}</p>
                <p className="text-white/35 text-xs mt-1">Extracting brand DNA, visual system, and conversion flow…</p>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-center">
                {['Brand Identity', 'Visual System', 'UX Patterns', 'Cinematic Concepts'].map(label => (
                  <span key={label} className="text-[11px] px-2 py-0.5 rounded-full bg-white/4 text-white/25 border border-white/8">
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

          {/* Feature grid */}
          {phase === 'idle' && (
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl w-full animate-fade-up">
              {FEATURES.map(f => (
                <div key={f.label} className="bg-surface-card border border-surface-border rounded-xl p-3.5 space-y-1">
                  <span className="text-accent text-base">{f.icon}</span>
                  <p className="text-xs font-semibold text-white/80">{f.label}</p>
                  <p className="text-[11px] text-white/30 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── RESULTS STATE ── */}
      {phase === 'complete' && result && (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-white/25 text-[11px] mb-0.5">Analyzed</p>
              <p className="text-white font-medium text-sm truncate max-w-xs sm:max-w-lg">{analyzedUrl}</p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-white/35 hover:text-white transition-colors flex items-center gap-1 shrink-0 ml-4"
            >
              ← New Analysis
            </button>
          </div>

          {/* Phase stepper */}
          <PhaseStepper phases={PHASES} activePhase={activeTab} completedPhases={PHASE_ORDER} />

          {/* Tab bar */}
          <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
            {PHASES.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === p.id
                    ? 'bg-accent text-white shadow-lg'
                    : 'text-white/35 hover:text-white/60 hover:bg-white/4'
                }`}
              >
                <span>{p.icon}</span>
                <span className="hidden sm:block">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Phase content */}
          <div key={activeTab}>
            {activeTab === 'brand-analysis' && <BrandAnalysisCard data={result.websiteAnalysis} />}
            {activeTab === 'brand-card' && <BrandCard data={result.brandCard} />}
            {activeTab === 'cinematic-concepts' && <CinematicConcepts concepts={result.cinematicConcepts} />}
            {activeTab === 'build-plan' && <BuildPlan data={result.buildPlan} />}
            {activeTab === 'copywriting' && <CopywritingMap data={result.copywritingMap} />}
            {activeTab === 'deployment' && <DeploymentGuide data={result.deploymentGuide} />}
          </div>

          {/* Prev / Next nav */}
          <div className="flex justify-between pt-4 border-t border-surface-border">
            <button
              onClick={() => activeTabIndex > 0 && setActiveTab(PHASE_ORDER[activeTabIndex - 1])}
              disabled={activeTabIndex === 0}
              className="text-xs text-white/35 hover:text-white/65 disabled:opacity-20 transition-colors"
            >
              ← Previous Phase
            </button>
            <button
              onClick={() =>
                activeTabIndex < PHASE_ORDER.length - 1 &&
                setActiveTab(PHASE_ORDER[activeTabIndex + 1])
              }
              disabled={activeTabIndex === PHASE_ORDER.length - 1}
              className="text-xs text-white/35 hover:text-white/65 disabled:opacity-20 transition-colors"
            >
              Next Phase →
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}
