interface PhaseStep {
  id: string
  label: string
  icon: string
}

interface Props {
  phases: PhaseStep[]
  activePhase: string
  completedPhases: string[]
}

export function PhaseStepper({ phases, activePhase, completedPhases }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max">
        {phases.map((phase, idx) => {
          const isCompleted = completedPhases.includes(phase.id)
          const isActive = phase.id === activePhase
          return (
            <div key={phase.id} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-accent/20 text-accent border border-accent/40'
                    : isCompleted
                    ? 'bg-white/5 text-white/50 border border-white/10'
                    : 'text-white/20 border border-transparent'
                }`}
              >
                <span>{phase.icon}</span>
                <span className="hidden md:block">{phase.label}</span>
              </div>
              {idx < phases.length - 1 && (
                <div
                  className={`w-3 h-px mx-0.5 transition-colors ${
                    isCompleted ? 'bg-accent/30' : 'bg-white/8'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
