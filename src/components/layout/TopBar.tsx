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
    <header className="flex-shrink-0 bg-white border-b border-gray-200">
      {/* Blue top accent bar */}
      <div className="h-1 bg-[#0072c6]" />

      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: back + title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-[#0072c6] hover:text-[#005fa3] transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="w-px h-5 bg-gray-200" />

          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-[#0072c6]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l8.66 5v10L12 22 3.34 17V7L12 2z" />
              <circle cx="12" cy="12" r="2.5" strokeWidth={1.5} />
              <line x1="12" y1="9.5" x2="12" y2="7" strokeWidth={1.5} />
              <line x1="12" y1="14.5" x2="12" y2="17" strokeWidth={1.5} />
              <line x1="9.83" y1="10.75" x2="7.5" y2="9.4" strokeWidth={1.5} />
              <line x1="14.17" y1="13.25" x2="16.5" y2="14.6" strokeWidth={1.5} />
              <line x1="9.83" y1="13.25" x2="7.5" y2="14.6" strokeWidth={1.5} />
              <line x1="14.17" y1="10.75" x2="16.5" y2="9.4" strokeWidth={1.5} />
            </svg>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 leading-tight">New Kubernetes Cluster</h1>
              <p className="text-xs text-gray-400 leading-tight">Cluster API · VCF 9.x</p>
            </div>
          </div>
        </div>

        {/* Right: badges + author */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-medium bg-[#e8f2fb] text-[#0072c6] border border-[#b8d9f5]">
            Cluster API
          </span>
          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
            VCF 9.x
          </span>
          <span className="text-xs text-gray-300">|</span>
          <a
            href="https://github.com/lidorzx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-[#0072c6] transition-colors"
          >
            by Lidor Eliya
          </a>
        </div>
      </div>
    </header>
  );
}
