import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-white font-sans">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-electric/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-surface-border bg-surface/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-gradient-to-br from-accent to-electric rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">C</span>
            </div>
            <span className="font-display font-bold text-sm tracking-wide text-white">CINEMATIC</span>
            <span className="text-white/25 text-sm hidden sm:block">Site Recreator</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/25 hidden sm:block font-mono">AI-Powered · v1.0</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
      </header>

      <main className="relative z-10">{children}</main>
    </div>
  )
}
