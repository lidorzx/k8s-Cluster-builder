import { useClusterClassStore } from '../../store/useClusterClassStore';
import { LogoMark } from '../ui/LogoMark';

interface TopBarProps {
  onBack: () => void;
  showTux: boolean;
  onToggleTux: () => void;
}

export function TopBar({ onBack, showTux, onToggleTux }: TopBarProps) {
  const resetToDefaults = useClusterClassStore((s) => s.resetToDefaults);

  const handleBack = () => {
    if (window.confirm('Go back to the home page? Any unsaved changes will be lost.')) {
      resetToDefaults();
      onBack();
    }
  };

  return (
    <header className="z-20 flex-shrink-0 border-b border-ink-100 bg-white/80 backdrop-blur-xl">
      {/* Gradient accent bar */}
      <div className="h-1 bg-brand-gradient bg-[length:200%_200%] animate-gradient-x" />

      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: back + title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-medium text-ink-500 transition-colors hover:text-brand-600"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="h-5 w-px bg-ink-200" />

          <div className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <div>
              <h1 className="text-sm font-semibold leading-tight text-ink-900">New Kubernetes Cluster</h1>
              <p className="text-xs leading-tight text-ink-400">Cluster API · VCF 9.x</p>
            </div>
          </div>
        </div>

        {/* Right: tux toggle + badges */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleTux}
            title={showTux ? 'Hide Tux' : 'Show Tux'}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
              showTux
                ? 'border-brand-200 bg-brand-50 text-brand-600 shadow-soft'
                : 'border-ink-200 bg-white text-ink-400 hover:text-ink-600'
            }`}
          >
            <span className={showTux ? '' : 'grayscale'}>🐧</span>
            Tux
          </button>

          <span className="ui-chip border border-brand-100 bg-brand-50 text-brand-600">Cluster API</span>
          <span className="ui-chip border border-ink-200 bg-ink-50 text-ink-500">VCF 9.x</span>
          <span className="text-xs text-ink-300">|</span>
          <a
            href="https://github.com/lidorzx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ink-400 transition-colors hover:text-brand-600"
          >
            by Lidor Eliya
          </a>
        </div>
      </div>
    </header>
  );
}
