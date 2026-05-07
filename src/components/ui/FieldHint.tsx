import { useState } from 'react';

interface FieldHintProps {
  label: string;
  children: React.ReactNode;
}

export function FieldHint({ label, children }: FieldHintProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-[#0072c6] hover:underline transition-colors"
      >
        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {label}
        <svg
          className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="mt-2 border border-[#b8d9f5] bg-[#f0f7ff] p-3 text-xs text-gray-600 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function KubectlBlock({ command }: { command: string }) {
  return (
    <pre className="font-mono bg-gray-900 text-green-400 px-3 py-2 overflow-x-auto leading-relaxed text-xs">
      {command}
    </pre>
  );
}
