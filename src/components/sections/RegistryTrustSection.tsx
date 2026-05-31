import { SectionCard } from '../ui/SectionCard';
import { FormField } from '../ui/FormField';
import { FieldHint, KubectlBlock } from '../ui/FieldHint';
import { useClusterClassStore } from '../../store/useClusterClassStore';
import type { RegistryTrust } from '../../types/cluster';

const INPUT =
  'block w-full text-sm border border-gray-300 focus:border-[#0072c6] focus:outline-none focus:ring-1 focus:ring-[#0072c6] px-3 py-1.5';

interface Props {
  stepNumber: number;
  id?: string;
}

function RegistryCard({
  entry,
  onUpdate,
  onRemove,
}: {
  entry: RegistryTrust;
  onUpdate: (partial: Partial<RegistryTrust>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-gray-200 bg-gray-50 p-4 space-y-3">
      {/* Header row: label + remove */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-gray-500">
          {entry.registryHost || 'new registry'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors text-sm leading-none"
          aria-label="Remove registry"
        >
          ✕
        </button>
      </div>

      {/* Registry host (label only) */}
      <div>
        <label className="block text-xs text-gray-500 mb-0.5">
          Registry host <span className="text-gray-400">(label only)</span>
        </label>
        <input
          type="text"
          value={entry.registryHost}
          onChange={(e) => onUpdate({ registryHost: e.target.value })}
          placeholder="e.g. artifactory.company.com"
          className={INPUT}
        />
      </div>

      {/* Mode selector */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Certificate source</label>
        <div className="flex gap-2">
          {(
            [
              { value: 'paste', label: 'Paste certificate' },
              { value: 'existing', label: 'Use existing secret' },
            ] as const
          ).map((opt) => {
            const active = entry.mode === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate({ mode: opt.value })}
                className={`flex-1 px-3 py-1.5 text-xs font-medium border transition-colors ${
                  active
                    ? 'border-[#0072c6] bg-[#f0f7ff] text-[#0072c6]'
                    : 'border-gray-300 bg-white text-gray-500 hover:border-[#0072c6]/40'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {entry.mode === 'paste' ? (
        <>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">CA data key</label>
            <input
              type="text"
              value={entry.caKey}
              onChange={(e) => onUpdate({ caKey: e.target.value })}
              placeholder="registry-ca"
              className={INPUT}
            />
            <p className="mt-1 text-xs text-gray-400">
              The key under which this certificate is stored in the generated Secret.
            </p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">CA certificate (PEM)</label>
            <textarea
              value={entry.certPem}
              onChange={(e) => onUpdate({ certPem: e.target.value })}
              placeholder={'-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----'}
              spellCheck={false}
              rows={5}
              className={`${INPUT} font-mono text-xs leading-relaxed resize-y`}
            />
            <p className="mt-1 text-xs text-gray-400">
              Paste the issuing CA's certificate. The builder base64-encodes it and adds a Secret
              document above the Cluster.
            </p>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Secret name</label>
            <input
              type="text"
              value={entry.secretName}
              onChange={(e) => onUpdate({ secretName: e.target.value })}
              placeholder="artifactory-ca-trust-secret"
              className={INPUT}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Secret data key</label>
            <input
              type="text"
              value={entry.secretKey}
              onChange={(e) => onUpdate({ secretKey: e.target.value })}
              placeholder="artifactory-ca"
              className={INPUT}
            />
            <p className="mt-1 text-xs text-gray-400">
              References a Secret you already created in the Supervisor namespace.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export function RegistryTrustSection({ stepNumber, id }: Props) {
  const {
    registryTrust,
    registryTrustSecretName,
    update,
    addRegistryTrust,
    removeRegistryTrust,
    updateRegistryTrust,
  } = useClusterClassStore();

  const hasPasted = registryTrust.some((r) => r.mode === 'paste');

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="Private Registry Trust"
      description={
        registryTrust.length > 0
          ? `${registryTrust.length} registr${registryTrust.length === 1 ? 'y' : 'ies'}`
          : 'Optional'
      }
      id={id}
    >
      <div>
        <p className="text-sm text-gray-500 mb-4">
          Add the CA certificate of a private registry (e.g. JFrog Artifactory, Harbor) so the
          cluster nodes trust it. Without this, image pulls fail with{' '}
          <span className="font-mono text-gray-600">x509: certificate signed by unknown authority</span>.
        </p>

        <FieldHint label="Trust vs. authentication — what this does and doesn't do">
          <p>
            <strong>This section configures trust only</strong> — it makes nodes accept the
            registry's TLS certificate. It does <strong>not</strong> log in to the registry.
          </p>
          <p>
            If your registry needs credentials to pull, create a{' '}
            <span className="font-mono">docker-registry</span> pull secret inside the guest cluster
            after it is provisioned:
          </p>
          <KubectlBlock command={'kubectl create secret docker-registry regcred \\\n  --docker-server=artifactory.company.com \\\n  --docker-username=<user> --docker-password=<token> \\\n  -n <workload-namespace>'} />
          <p className="text-gray-500">
            Skip this whole section if the registry uses a publicly-trusted certificate.
          </p>
        </FieldHint>

        {hasPasted && (
          <div className="mt-4">
            <FormField label="Trust Secret Name" htmlFor="trust-secret-name">
              <input
                id="trust-secret-name"
                type="text"
                value={registryTrustSecretName}
                onChange={(e) => update({ registryTrustSecretName: e.target.value })}
                placeholder="registry-ca-trust-secret"
                className={INPUT}
              />
              <p className="mt-1 text-xs text-gray-400">
                Name of the Secret the builder generates for pasted certificates. It is created in
                the same namespace as the cluster.
              </p>
            </FormField>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {registryTrust.length === 0 ? (
            <p className="text-sm italic text-gray-400">No private registries configured.</p>
          ) : (
            registryTrust.map((entry) => (
              <RegistryCard
                key={entry.id}
                entry={entry}
                onUpdate={(partial) => updateRegistryTrust(entry.id, partial)}
                onRemove={() => removeRegistryTrust(entry.id)}
              />
            ))
          )}

          <div className="pt-1">
            <button
              type="button"
              onClick={addRegistryTrust}
              className="px-4 py-1.5 text-sm text-[#0072c6] border border-[#0072c6] hover:bg-[#f0f7ff] font-medium transition-colors"
            >
              ADD REGISTRY
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
