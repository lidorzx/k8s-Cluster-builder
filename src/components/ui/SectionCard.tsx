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
      className={`ui-card scroll-mt-6 overflow-hidden transition-shadow duration-200 ${
        open ? 'shadow-card ring-1 ring-brand-500/10' : 'shadow-soft hover:shadow-card'
      }`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-ink-50/60"
      >
        {/* Step badge */}
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all duration-200 ${
            open
              ? 'bg-brand-gradient text-white shadow-glow'
              : 'bg-ink-100 text-ink-500 group-hover:bg-ink-200'
          }`}
        >
          {stepNumber}
        </div>

        <div className="min-w-0 flex-1">
          <span className={`text-[0.95rem] font-semibold ${open ? 'text-ink-900' : 'text-ink-600'}`}>
            {title}
          </span>
          {description && !open && (
            <span className="ml-2 text-xs text-ink-400">{description}</span>
          )}
        </div>

        {description && !open && (
          <span className="ui-chip mr-1 bg-brand-50 text-brand-600">{description}</span>
        )}

        <svg
          className={`h-4 w-4 flex-shrink-0 text-ink-400 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body */}
      {open && (
        <div className="animate-fade-in border-t border-ink-100 px-6 pb-6 pt-4">
          {children}

          {!hideNext && (
            <div className="mt-6 border-t border-ink-100 pt-5">
              <button type="button" onClick={handleNext} className="ui-btn-primary tracking-wide">
                Next
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
