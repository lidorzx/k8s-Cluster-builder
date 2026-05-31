import { SectionCard } from '../ui/SectionCard';
import { FormField } from '../ui/FormField';
import { FieldHint, KubectlBlock } from '../ui/FieldHint';
import { useClusterClassStore } from '../../store/useClusterClassStore';
import type { RegistryTrust } from '../../types/cluster';

const INPUT = 'ui-input';

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
    <div className="space-y-3 rounded-xl border border-ink-200 bg-ink-50/60 p-4">
      {/* Header row: label + remove */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-ink-500">
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
                className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-soft'
                    : 'border-ink-200 bg-white text-ink-500 hover:border-brand-300'
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

function SubHeading({ step, title, subtitle }: { step: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-baseline gap-2 mb-3">
      <span className="text-xs font-bold text-brand-600">{step}</span>
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

export function RegistryTrustSection({ stepNumber, id }: Props) {
  const {
    registryTrust,
    registryTrustSecretName,
    registryAuth,
    update,
    addRegistryTrust,
    removeRegistryTrust,
    updateRegistryTrust,
    updateRegistryAuth,
  } = useClusterClassStore();

  const hasPasted = registryTrust.some((r) => r.mode === 'paste');

  const sectionDesc = [
    registryTrust.length > 0 ? `${registryTrust.length} trusted` : null,
    registryAuth.enabled ? 'auth on' : null,
  ]
    .filter(Boolean)
    .join(' · ') || 'Optional';

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="Private Registry"
      description={sectionDesc}
      id={id}
    >
      <div>
        <SubHeading step="1" title="Trust — CA certificate" subtitle="Make nodes trust the registry's TLS certificate" />
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
            If your registry needs credentials to pull, enable{' '}
            <strong>Authentication</strong> in step 2 below — the builder produces the equivalent
            of:
          </p>
          <KubectlBlock command={'kubectl create secret docker-registry regcred \\\n  --docker-server=artifactory.company.com \\\n  --docker-username=<user> --docker-password=<token> \\\n  -n <workload-namespace>'} />
          <p className="text-gray-500">
            Skip the Trust step entirely if the registry uses a publicly-trusted certificate.
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

          <button type="button" onClick={addRegistryTrust} className="ui-btn-outline">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add registry
          </button>
        </div>

        {/* ── Authentication (pull secret) ── */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <SubHeading step="2" title="Authentication — pull secret" subtitle="Credentials to pull from the registry (optional)" />

          <label className="flex items-center gap-2 cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={registryAuth.enabled}
              onChange={(e) => updateRegistryAuth({ enabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300"
            />
            <span className="text-sm text-gray-700">Generate a docker-registry pull secret</span>
          </label>

          {registryAuth.enabled && (
            <>
              <div className="border border-amber-200 bg-amber-50 px-3 py-2 mb-3 flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <p className="text-xs text-amber-700">
                  This secret is applied to the <strong>guest cluster</strong> (your workload namespace), not
                  the Supervisor — it appears as its own document. Credentials stay in your browser; nothing
                  is uploaded.
                </p>
              </div>

              <FormField label="Pull Secret Name" htmlFor="auth-secret-name" required>
                <input
                  id="auth-secret-name"
                  type="text"
                  value={registryAuth.secretName}
                  onChange={(e) => updateRegistryAuth({ secretName: e.target.value })}
                  placeholder="regcred"
                  className={INPUT}
                />
              </FormField>

              <FormField label="Workload Namespace" htmlFor="auth-namespace" required>
                <input
                  id="auth-namespace"
                  type="text"
                  value={registryAuth.namespace}
                  onChange={(e) => updateRegistryAuth({ namespace: e.target.value })}
                  placeholder="default"
                  className={INPUT}
                />
                <p className="mt-1 text-xs text-gray-400">
                  The namespace inside the guest cluster where your pods run.
                </p>
              </FormField>

              <FormField label="Registry Server" htmlFor="auth-server" required>
                <input
                  id="auth-server"
                  type="text"
                  value={registryAuth.registryServer}
                  onChange={(e) => updateRegistryAuth({ registryServer: e.target.value })}
                  placeholder="artifactory.company.com"
                  className={INPUT}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Must match the host in your image references exactly (the <span className="font-mono">--docker-server</span> value).
                </p>
              </FormField>

              <FormField label="Username" htmlFor="auth-username" required>
                <input
                  id="auth-username"
                  type="text"
                  autoComplete="off"
                  value={registryAuth.username}
                  onChange={(e) => updateRegistryAuth({ username: e.target.value })}
                  className={INPUT}
                />
              </FormField>

              <FormField label="Password / Token" htmlFor="auth-password" required>
                <input
                  id="auth-password"
                  type="password"
                  autoComplete="off"
                  value={registryAuth.password}
                  onChange={(e) => updateRegistryAuth({ password: e.target.value })}
                  placeholder="access token"
                  className={INPUT}
                />
              </FormField>

              <FormField label="Email" htmlFor="auth-email">
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="off"
                  value={registryAuth.email}
                  onChange={(e) => updateRegistryAuth({ email: e.target.value })}
                  className={INPUT}
                />
              </FormField>
            </>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
