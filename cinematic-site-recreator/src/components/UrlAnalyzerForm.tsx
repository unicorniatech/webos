import { useState } from 'react'
import { validateUrl } from '../lib/analyzer'

interface Props {
  onAnalyze: (url: string) => void
  isLoading: boolean
}

const EXAMPLES = ['apple.com', 'airbnb.com', 'notion.so', 'linear.app', 'stripe.com']

export function UrlAnalyzerForm({ onAnalyze, isLoading }: Props) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { valid, normalized, error: err } = validateUrl(url)
    if (!valid) { setError(err ?? 'Invalid URL'); return }
    setError('')
    onAnalyze(normalized)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/30 to-electric/20 blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center bg-surface-card border border-surface-border group-focus-within:border-accent/50 rounded-xl overflow-hidden transition-colors">
            <div className="pl-4 text-white/25">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <input
              type="text"
              value={url}
              onChange={e => { setUrl(e.target.value); setError('') }}
              placeholder="Paste website URL — e.g. https://stripe.com"
              className="flex-1 bg-transparent px-3 py-4 text-sm text-white placeholder-white/20 outline-none"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="m-2 px-5 py-2.5 bg-accent hover:bg-accent-dim disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Website →'
              )}
            </button>
          </div>
        </div>
        {error && <p className="text-red-400 text-xs mt-2 px-1">{error}</p>}
      </form>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/20 text-xs">Try:</span>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            type="button"
            onClick={() => setUrl(`https://${ex}`)}
            className="text-xs text-white/30 hover:text-accent transition-colors px-2 py-0.5 rounded border border-white/10 hover:border-accent/30"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
