import { useRef, useState } from 'react';

interface SectionCardProps {
  stepNumber: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
  hideNext?: boolean;
}

export function SectionCard({
  stepNumber,
  title,
  description,
  children,
  defaultOpen = true,
  id,
  hideNext = false,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setOpen(false);
    const nextSibling = rootRef.current?.nextElementSibling as HTMLElement | null;
    if (nextSibling) {
      setTimeout(() => nextSibling.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      const nextBtn = nextSibling.querySelector('button') as HTMLButtonElement | null;
      nextBtn?.click();
    }
  };

  return (
    <div
      ref={rootRef}
      id={id}
      className={`bg-white transition-all ${open ? 'border-l-[3px] border-l-[#0072c6]' : 'border-l-[3px] border-l-transparent'}`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center px-6 py-3.5 text-left hover:bg-[#f5f8fb] transition-colors group"
      >
        {/* Step circle */}
        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 transition-colors ${
          open ? 'bg-[#0072c6] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
        }`}>
          {stepNumber}
        </div>

        <span className={`text-sm font-semibold ${open ? 'text-[#0072c6]' : 'text-gray-600'}`}>
          {title}
        </span>

        {description && !open && (
          <span className="ml-3 text-xs text-gray-400 truncate">{description}</span>
        )}

        <svg
          className={`w-4 h-4 ml-auto text-gray-400 flex-shrink-0 transition-transform duration-150 ${open ? '' : '-rotate-90'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body */}
      {open && (
        <div className="px-8 pb-6 pt-3 border-t border-gray-100">
          {children}

          {!hideNext && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-1.5 text-sm text-white bg-[#0072c6] hover:bg-[#005fa3] transition-colors font-medium tracking-wide"
              >
                NEXT
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
