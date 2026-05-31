interface SectionCardProps {
  stepNumber: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
  // Kept for backward-compatibility with callers; the wizard handles navigation.
  defaultOpen?: boolean;
  hideNext?: boolean;
}

/**
 * One wizard step: a header (gradient badge + title + description) followed by
 * its fields in a card. Navigation is owned by the App-level wizard, not here.
 */
export function SectionCard({ stepNumber, title, description, children, id }: SectionCardProps) {
  return (
    <section id={id} className="animate-fade-in-up">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-sm font-bold text-white shadow-glow">
          {stepNumber}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold leading-tight text-ink-900">{title}</h2>
          {description && <p className="text-sm text-ink-400">{description}</p>}
        </div>
      </div>
      <div className="ui-card p-6 sm:p-7">{children}</div>
    </section>
  );
}
