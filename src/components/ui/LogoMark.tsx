interface LogoMarkProps {
  className?: string;
  variant?: 'light' | 'dark';
}

// Tux-in-a-Kubernetes-helm brand mark (matches the favicon).
export function LogoMark({ className = 'w-6 h-6' }: LogoMarkProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="lm-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e6ebf4" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="15" fill="url(#lm-bg)" />

      {/* Kubernetes helm accent */}
      <g stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1.6" strokeLinejoin="round" fill="none">
        <polygon points="32,9 51.7,16.6 56,37.2 43,53.5 21,53.5 8,37.2 12.3,16.6" />
        <g strokeWidth="1.3">
          <path d="M32 32 32 14" />
          <path d="M32 32 48.5 21" />
          <path d="M32 32 49 39" />
          <path d="M32 32 39 50" />
          <path d="M32 32 25 50" />
          <path d="M32 32 15 39" />
          <path d="M32 32 15.5 21" />
        </g>
      </g>

      {/* Tux */}
      <ellipse cx="32" cy="35" rx="13.5" ry="16" fill="#13131a" />
      <ellipse cx="32" cy="38.5" rx="8.4" ry="12" fill="url(#lm-belly)" />
      <ellipse cx="26" cy="51.5" rx="4.2" ry="2.1" fill="#f59e0b" />
      <ellipse cx="38" cy="51.5" rx="4.2" ry="2.1" fill="#f59e0b" />
      <rect x="20.5" y="25" width="23" height="6.6" rx="3.3" fill="#0a0e1c" />
      <rect x="22" y="26.3" width="9" height="4" rx="2" fill="#0e2748" />
      <rect x="33" y="26.3" width="9" height="4" rx="2" fill="#0e2748" />
      <circle cx="26.5" cy="28.3" r="1.7" fill="#22d3ee" />
      <circle cx="37.5" cy="28.3" r="1.7" fill="#22d3ee" />
      <path d="M32 33.5l4 3-4 2.6-4-2.6z" fill="#f59e0b" />
    </svg>
  );
}
