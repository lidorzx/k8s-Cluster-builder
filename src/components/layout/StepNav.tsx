export interface Step {
  label: string;
  sub: string;
}

interface StepNavProps {
  steps: Step[];
  current: number;
  onSelect: (index: number) => void;
}

export function StepNav({ steps, current, onSelect }: StepNavProps) {
  return (
    <nav className="scroll-light hidden w-60 flex-shrink-0 overflow-y-auto border-r border-ink-100 bg-white/70 backdrop-blur-xl md:block">
      <div className="px-4 py-5">
        <div className="mb-3 flex items-center justify-between px-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Steps</span>
          <span className="text-xs font-medium text-ink-400">
            {current + 1}<span className="text-ink-300">/{steps.length}</span>
          </span>
        </div>

        <ol className="space-y-0.5">
          {steps.map((s, i) => {
            const active = i === current;
            const done = i < current;
            return (
              <li key={s.label} className="relative">
                {/* connector line to the previous circle */}
                {i > 0 && (
                  <span
                    className={`absolute left-[1.85rem] top-0 h-3 w-px -translate-x-1/2 ${done || active ? 'bg-brand-300' : 'bg-ink-200'}`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    active ? 'bg-brand-50' : 'hover:bg-ink-50'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      active
                        ? 'bg-brand-gradient text-white shadow-glow'
                        : done
                        ? 'bg-brand-gradient text-white'
                        : 'bg-ink-100 text-ink-400 group-hover:bg-ink-200'
                    }`}
                  >
                    {done ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-sm font-semibold leading-tight ${active ? 'text-brand-700' : 'text-ink-700'}`}>
                      {s.label}
                    </span>
                    <span className="block truncate text-xs text-ink-400">{s.sub}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
