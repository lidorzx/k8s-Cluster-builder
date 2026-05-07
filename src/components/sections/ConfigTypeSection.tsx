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
      <div className="space-y-3 pt-1">
        {options.map((opt) => {
          const active = configType === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                active
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="config-type"
                value={opt.value}
                checked={active}
                onChange={() => update({ configType: opt.value })}
                className="mt-0.5 w-4 h-4 text-sky-600 border-gray-300 flex-shrink-0"
              />
              <div>
                <span className={`text-sm font-medium ${active ? 'text-sky-800' : 'text-gray-800'}`}>
                  {opt.label}
                </span>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.description}</p>
              </div>
            </label>
          );
        })}
      </div>
    </SectionCard>
  );
}
