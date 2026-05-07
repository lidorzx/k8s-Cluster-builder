import { useClusterClassStore } from '../../store/useClusterClassStore';
import { LogoMark } from '../ui/LogoMark';

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
            <LogoMark className="w-7 h-7" />
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
