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
    <div className="flex items-start py-3 border-b border-gray-100 last:border-b-0">
      <div className="w-56 flex-shrink-0 pt-2 pr-6">
        <label htmlFor={htmlFor} className="text-sm text-gray-800 leading-tight">
          {label}
        </label>
        {!required && (
          <span className="block text-xs text-gray-400 mt-0.5">(Optional)</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      </div>
    </div>
  );
}
