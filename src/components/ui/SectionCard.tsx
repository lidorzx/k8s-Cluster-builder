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
      // Open the next section by clicking its header button
      const nextBtn = nextSibling.querySelector('button') as HTMLButtonElement | null;
      nextBtn?.click();
    }
  };

  return (
    <div
      ref={rootRef}
      id={id}
      className={`bg-white transition-all ${
        open ? 'border-l-[3px] border-l-blue-600' : 'border-l-[3px] border-l-transparent'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <svg
          className={`w-4 h-4 text-gray-400 mr-3 flex-shrink-0 transition-transform duration-150 ${
            open ? '' : '-rotate-90'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>

        <span className={`text-sm mr-1.5 ${open ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
          {stepNumber}.
        </span>
        <span className={`text-sm ${open ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
          {title}
        </span>

        {description && (
          <span className={`ml-auto text-sm font-normal pl-8 ${open ? 'text-gray-500' : 'text-sky-600'}`}>
            {description}
          </span>
        )}
      </button>

      {open && (
        <div className="px-8 pb-6 pt-2 border-t border-gray-100">
          {children}

          {/* NEXT button — matches VCF wizard style */}
          {!hideNext && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-1.5 text-sm text-sky-700 border border-sky-600 hover:bg-sky-50 transition-colors font-medium tracking-wide"
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
