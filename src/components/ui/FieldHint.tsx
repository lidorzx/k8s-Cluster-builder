import { useState } from 'react';

interface FieldHintProps {
  label: string;
  children: React.ReactNode;
}

export function FieldHint({ label, children }: FieldHintProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
      >
        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {label}
        <svg
          className={`h-3 w-3 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="mt-2 animate-fade-in space-y-2 rounded-xl border border-brand-100 bg-brand-50/60 p-3.5 text-xs leading-relaxed text-ink-600">
          {children}
        </div>
      )}
    </div>
  );
}

export function KubectlBlock({ command }: { command: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-ink-900 px-3 py-2.5 font-mono text-xs leading-relaxed text-emerald-300 shadow-soft">
      {command}
    </pre>
  );
}
