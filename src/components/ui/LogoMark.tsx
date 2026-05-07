interface LogoMarkProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function LogoMark({ className = 'w-6 h-6', variant = 'light' }: LogoMarkProps) {
  const stroke = variant === 'dark' ? '#ffffff' : '#0ea5e9';
  const accent = variant === 'dark' ? '#7dd3fc' : '#0369a1';

  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill={variant === 'dark' ? '#0f172a' : '#e0f2fe'} />
      <path
        d="M16 5.2 25.35 10.6v10.8L16 26.8 6.65 21.4V10.6L16 5.2Z"
        fill={variant === 'dark' ? '#075985' : '#ffffff'}
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3.25" fill={accent} />
      <path
        d="M16 8.6v4.2M16 19.2v4.2M9.55 12.35l3.65 2.1M18.8 17.55l3.65 2.1M9.55 19.65l3.65-2.1M18.8 14.45l3.65-2.1"
        stroke={stroke}
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M16 10.25 20.95 13.1v5.8L16 21.75 11.05 18.9v-5.8L16 10.25Z"
        stroke={accent}
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}
