import { useClusterClassStore } from '../../store/useClusterClassStore';

interface TopBarProps {
  onBack: () => void;
}

export function TopBar({ onBack }: TopBarProps) {
  const resetToDefaults = useClusterClassStore((s) => s.resetToDefaults);

  const handleBack = () => {
    if (window.confirm('Go back to the home page? Any unsaved changes will be lost.')) {
      resetToDefaults();
      onBack();
    }
  };

  return (
    <header className="flex-shrink-0 bg-gradient-to-b from-sky-100 to-blue-50 border-b border-blue-100 px-6 pt-4 pb-5">
      <button
        type="button"
        className="flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 mb-3 transition-colors"
        onClick={handleBack}
        title="Back to home"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        BACK
      </button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-7 h-7 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l8.66 5v10L12 22 3.34 17V7L12 2z" />
            <circle cx="12" cy="12" r="2.5" strokeWidth={1.5} />
            <line x1="12" y1="9.5" x2="12" y2="7" strokeWidth={1.5} />
            <line x1="12" y1="14.5" x2="12" y2="17" strokeWidth={1.5} />
            <line x1="9.83" y1="10.75" x2="7.5" y2="9.4" strokeWidth={1.5} />
            <line x1="14.17" y1="13.25" x2="16.5" y2="14.6" strokeWidth={1.5} />
            <line x1="9.83" y1="13.25" x2="7.5" y2="14.6" strokeWidth={1.5} />
            <line x1="14.17" y1="10.75" x2="16.5" y2="9.4" strokeWidth={1.5} />
          </svg>
          <h1 className="text-xl font-medium text-gray-900">New Kubernetes Cluster</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Cluster API
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            VCF 9.x
          </span>
          <a
            href="https://github.com/lidorzx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            by Lidor Eliya
          </a>
        </div>
      </div>
    </header>
  );
}
