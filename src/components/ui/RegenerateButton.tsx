interface RegenerateButtonProps {
  onClick: () => void;
  title?: string;
}

// Re-rolls the cluster-name suffix so back-to-back clusters don't collide in the same
// namespace. Uses items-stretch in the parent to match the adjacent input's height.
export function RegenerateButton({ onClick, title = 'Roll a new unique suffix' }: RegenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex flex-shrink-0 items-center justify-center rounded-lg border border-ink-200 bg-white px-3 text-ink-500 transition-colors hover:border-brand-300 hover:text-brand-600"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  );
}
