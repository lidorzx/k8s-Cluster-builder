interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-ink-100 py-3.5 last:border-b-0 sm:flex-row sm:items-start sm:gap-6">
      <div className="w-full flex-shrink-0 pt-1.5 sm:w-52">
        <label htmlFor={htmlFor} className="text-sm font-medium leading-tight text-ink-700">
          {label}
          {required && <span className="ml-0.5 text-brand-500">*</span>}
        </label>
        {!required && <span className="ml-1 text-xs text-ink-300">optional</span>}
      </div>
      <div className="min-w-0 flex-1">
        {children}
        {error && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-500">
            <svg className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && <p className="mt-1.5 text-xs text-ink-400">{hint}</p>}
      </div>
    </div>
  );
}
