import { useState } from 'react'
import type { CopywritingMapData } from '../types'

export function CopywritingMap({ data }: { data: CopywritingMapData }) {
  const [open, setOpen] = useState<string | null>(data.entries[0]?.section ?? null)

  return (
    <div className="space-y-2 animate-fade-up">
      <p className="text-white/35 text-sm mb-3">
        Improved commercial copy for each section — based on the analyzed site.
      </p>
      {data.entries.map(entry => {
        const isOpen = open === entry.section
        return (
          <div
            key={entry.section}
            className="bg-surface-card border border-surface-border rounded-xl overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-4 hover:bg-white/2 transition-colors text-left"
              onClick={() => setOpen(isOpen ? null : entry.section)}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-accent/15 text-accent text-xs flex items-center justify-center font-bold">
                  {entry.section[0]}
                </div>
                <span className="text-sm font-medium text-white">{entry.section}</span>
              </div>
              <span className="text-white/25 text-xs ml-2">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">Original Intent</p>
                  <p className="text-xs text-white/45">{entry.originalIntent}</p>
                </div>
                <div>
                  <p className="text-[10px] text-green-400/60 uppercase tracking-widest mb-1">Improved Copy</p>
                  <p className="text-sm text-white/75 bg-white/3 rounded-lg p-3 border border-white/5 leading-relaxed whitespace-pre-line">
                    {entry.improvedCopy}
                  </p>
                </div>
                <div className="flex items-start gap-4 flex-wrap">
                  <div>
                    <p className="text-[10px] text-accent/60 uppercase tracking-widest mb-1">CTA</p>
                    <span className="text-xs px-3 py-1 bg-accent/10 border border-accent/25 text-accent rounded-lg">
                      {entry.cta}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">Copywriting Notes</p>
                    <p className="text-xs text-white/35 italic leading-relaxed">{entry.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
