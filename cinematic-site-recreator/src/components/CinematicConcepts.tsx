import { useState } from 'react'
import type { CinematicConcept } from '../types'

function PromptBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-white/30 uppercase tracking-widest">{label}</p>
        <button onClick={copy} className="text-[10px] text-white/25 hover:text-accent transition-colors">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-xs text-white/45 font-mono bg-black/30 rounded-lg p-3 border border-white/5 leading-relaxed">
        {text}
      </p>
    </div>
  )
}

export function CinematicConcepts({ concepts }: { concepts: CinematicConcept[] }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="space-y-4 animate-fade-up">
      <p className="text-white/35 text-sm">
        Choose a cinematic hero concept. Each includes image & video generation prompts.
      </p>

      {concepts.map(concept => {
        const isSelected = selected === concept.id
        const isExpanded = expanded === concept.id

        return (
          <div
            key={concept.id}
            className={`bg-surface-card border rounded-xl overflow-hidden transition-all duration-300 ${
              isSelected ? 'border-accent glow-accent' : 'border-surface-border hover:border-white/15'
            }`}
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <button
                  onClick={() => setSelected(isSelected ? null : concept.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all ${
                    isSelected ? 'bg-accent/20 text-accent' : 'bg-white/5 text-white/30 hover:bg-white/10'
                  }`}
                >
                  {concept.icon}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-white">{concept.title}</h3>
                      {isSelected && (
                        <span className="text-[10px] px-2 py-0.5 bg-accent/20 text-accent rounded-full border border-accent/30">
                          Selected
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : concept.id)}
                      className="text-white/25 hover:text-white/50 text-xs transition-colors shrink-0"
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  </div>
                  <p className="text-xs text-white/35 mb-2">{concept.bestUseCase}</p>
                  <p className="text-sm text-white/60 leading-relaxed">{concept.description}</p>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Camera Movement', value: concept.cameraMovement },
                      { label: 'Scroll Behavior', value: concept.scrollBehavior },
                      { label: 'Emotional Intent', value: concept.emotionalIntent },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">{label}</p>
                        <p className="text-sm text-white/55">{value}</p>
                      </div>
                    ))}
                  </div>
                  <PromptBlock label="Image Prompt (Midjourney / Firefly)" text={concept.imagePrompt} />
                  <PromptBlock label="Video Prompt (Sora / Runway)" text={concept.videoPrompt} />
                </div>
              )}
            </div>
          </div>
        )
      })}

      {selected !== null && (
        <div className="bg-accent/8 border border-accent/25 rounded-xl p-4 text-sm text-accent/90">
          ✦ Concept selected — build plan and copywriting are tailored to this hero concept.
        </div>
      )}
    </div>
  )
}
