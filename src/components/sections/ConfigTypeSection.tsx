import { SectionCard } from '../ui/SectionCard';
import { useClusterClassStore } from '../../store/useClusterClassStore';

interface ConfigTypeSectionProps {
  stepNumber: number;
  id?: string;
}

const options = [
  {
    value: 'default' as const,
    label: 'Default Configuration',
    description: 'Standard cluster with VM class, storage class, and OS image settings. Minimal YAML — same as VCF Automation quick setup.',
  },
  {
    value: 'custom' as const,
    label: 'Custom Configuration',
    description: 'Full control: endpoint FQDNs, certificate rotation, NTP servers, additional volumes, per-pool overrides, and more.',
  },
];

export function ConfigTypeSection({ stepNumber, id }: ConfigTypeSectionProps) {
  const { configType, update } = useClusterClassStore();

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="Configuration Type"
      description={configType === 'default' ? 'Default Configuration' : 'Custom Configuration'}
      id={id}
    >
      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        {options.map((opt) => {
          const active = configType === opt.value;
          return (
            <label
              key={opt.value}
              className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all ${
                active
                  ? 'border-brand-400 bg-brand-50/70 shadow-glow'
                  : 'border-ink-200 bg-white hover:border-brand-300 hover:shadow-card'
              }`}
            >
              <input
                type="radio"
                name="config-type"
                value={opt.value}
                checked={active}
                onChange={() => update({ configType: opt.value })}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${active ? 'text-brand-700' : 'text-ink-800'}`}>
                  {opt.label}
                </span>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                    active ? 'border-transparent bg-brand-gradient' : 'border-ink-300 bg-white'
                  }`}
                >
                  {active && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{opt.description}</p>
            </label>
          );
        })}
      </div>
    </SectionCard>
  );
}
