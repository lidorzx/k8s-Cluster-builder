import { SectionCard } from '../ui/SectionCard';
import { useClusterClassStore } from '../../store/useClusterClassStore';
import { validateState } from '../../lib/validate';
import { useState } from 'react';

interface ReviewSectionProps {
  stepNumber: number;
  id?: string;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start py-2 border-b border-gray-100 last:border-b-0">
      <div className="w-48 flex-shrink-0 pr-4">
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <span className="text-sm font-medium text-[#0072c6]">{value || '—'}</span>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</div>
      <div className="border border-gray-100 bg-[#fafbfc]">{children}</div>
    </div>
  );
}

function DryRunHint({ fileName }: { fileName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 border border-[#b8d9f5] bg-[#f0f7ff]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-[#e6f2ff] transition-colors"
      >
        <svg className="w-3.5 h-3.5 text-[#0072c6] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs text-[#0072c6] font-medium flex-1">How to validate before applying</span>
        <svg className={`w-3 h-3 text-[#0072c6] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-[#b8d9f5] px-3 py-3 space-y-2.5">
          <p className="text-xs text-gray-600">
            Run a <strong>client-side dry-run</strong> to catch YAML/schema errors without creating anything:
          </p>
          <pre className="text-xs font-mono bg-gray-900 text-green-400 px-3 py-2 overflow-x-auto leading-relaxed">{`kubectl apply --dry-run=client -f ${fileName}`}</pre>
          <p className="text-xs text-gray-600">
            For a <strong>server-side dry-run</strong> (checks namespace exists, ClusterClass is present, etc.):
          </p>
          <pre className="text-xs font-mono bg-gray-900 text-green-400 px-3 py-2 overflow-x-auto leading-relaxed">{`kubectl apply --dry-run=server -f ${fileName}`}</pre>
          <p className="text-xs text-gray-400">Server-side requires connection to the VCF Supervisor cluster and proper RBAC permissions.</p>
        </div>
      )}
    </div>
  );
}

export function ReviewSection({ stepNumber, id }: ReviewSectionProps) {
  const state = useClusterClassStore();
  const isDefault = state.configType === 'default';
  const errors = validateState(state);
  const fileName = `${state.name || 'cluster'}-cluster.yaml`;

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="Review and Confirm"
      description="Review all the details before you deploy this cluster"
      id={id}
      hideNext
    >
      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="mb-5 border border-amber-300 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span className="text-sm font-semibold text-amber-700">Required fields are missing</span>
          </div>
          <ul className="space-y-1">
            {errors.map((e) => (
              <li key={e.field} className="text-xs text-amber-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                <strong>{e.field}</strong>: {e.message}
              </li>
            ))}
          </ul>
          <p className="text-xs text-amber-600 mt-2">Go back and fill in the missing fields before applying this YAML.</p>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-5">
        Your cluster will be deployed with the following configuration:
      </p>

      {isDefault ? (
        /* ── Default mode: compact VCF-style review ── */
        <div>
          <Group title="Cluster">
            <Row label="Kind" value="Cluster" />
            <Row label="Cluster Name" value={state.name} />
            <Row label="Kubernetes Release" value={state.kubernetesVersion} />
            <Row label="Namespace" value={state.namespace} />
          </Group>

          <Group title="Control Plane">
            <Row label="Replicas" value={String(state.controlPlane.replicas)} />
            <Row label="VM Class" value={state.vmClass} />
            <Row label="Storage Class" value={state.storageClass} />
            <Row label="OS Image" value={state.controlPlane.osImageName} />
            {state.controlPlane.contentLibrary && (
              <Row label="Content Library" value={state.controlPlane.contentLibrary} />
            )}
          </Group>

          <Group title="Node Pools">
            {state.workerPools.map((pool) => (
              <div key={pool.id} className="border-b border-gray-100 last:border-b-0">
                <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-600 font-mono">
                    {pool.name || `${state.name}-nodepool-…`}
                  </span>
                </div>
                <div className="px-0">
                  <Row label="Replicas" value={String(pool.replicas)} />
                  <Row label="VM Class" value={state.vmClass} />
                  <Row label="Storage Class" value={state.storageClass} />
                  <Row label="OS Image" value={pool.osImageName} />
                </div>
              </div>
            ))}
          </Group>
        </div>
      ) : (
        /* ── Custom mode: full review ── */
        <div>
          <Group title="Cluster">
            <Row label="Cluster Name" value={state.name} />
            <Row label="Namespace" value={state.namespace} />
            <Row label="Cluster Class" value={state.clusterClassName} />
            <Row label="Kubernetes Release" value={state.kubernetesVersion} />
            <Row label="Pods CIDR" value={state.podCidr} />
            <Row label="Services CIDR" value={state.serviceCidr} />
            <Row label="Service Domain" value={state.serviceDomain} />
            <Row label="VM Class" value={state.vmClass} />
            <Row label="Storage Class" value={state.storageClass} />
            <Row label="Default Storage Class" value={state.defaultStorageClass} />
            <Row label="Cluster FQDN" value={state.endpointFQDNs[0] ?? ''} />
            <Row label="NTP Server" value={state.ntpServers[0] ?? ''} />
            <Row label="Certificate Rotation" value={state.certificateRotationEnabled ? `Enabled — ${state.certificateRotationDays} days` : 'Disabled'} />
          </Group>

          <Group title="Control Plane">
            <Row label="Replicas" value={String(state.controlPlane.replicas)} />
            <Row label="OS Image" value={state.controlPlane.osImageName} />
            <Row label="Content Library" value={state.controlPlane.contentLibrary} />
            <Row label="Volumes" value={state.controlPlane.volumeOverrides.length > 0 ? `${state.controlPlane.volumeOverrides.length} volume(s)` : 'None'} />
          </Group>

          <Group title="Node Pools">
            {state.workerPools.map((pool) => (
              <div key={pool.id} className="border-b border-gray-100 last:border-b-0">
                <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-600 font-mono">
                    {pool.name || `${state.name}-nodepool-…`}
                  </span>
                </div>
                <Row label="Class" value={pool.poolClass} />
                <Row label="Replicas" value={String(pool.replicas)} />
                <Row label="OS Image" value={pool.osImageName} />
              </div>
            ))}
          </Group>

          {(state.registryTrust.length > 0 || state.registryAuth.enabled) && (
            <Group title="Private Registry">
              {state.registryTrust.map((r, i) => (
                <div key={r.id} className="border-b border-gray-100 last:border-b-0">
                  <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-600 font-mono">
                      trust · {r.registryHost || `registry-${i + 1}`}
                    </span>
                  </div>
                  <Row label="Certificate source" value={r.mode === 'paste' ? 'Pasted (Secret generated)' : 'Existing secret'} />
                  <Row
                    label="Secret"
                    value={r.mode === 'paste' ? state.registryTrustSecretName : r.secretName}
                  />
                  <Row label="Data key" value={r.mode === 'paste' ? r.caKey : r.secretKey} />
                </div>
              ))}
              {state.registryAuth.enabled && (
                <div className="border-b border-gray-100 last:border-b-0">
                  <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-600 font-mono">
                      auth · pull secret (guest cluster)
                    </span>
                  </div>
                  <Row label="Secret name" value={state.registryAuth.secretName} />
                  <Row label="Workload namespace" value={state.registryAuth.namespace} />
                  <Row label="Registry server" value={state.registryAuth.registryServer} />
                  <Row label="Username" value={state.registryAuth.username} />
                </div>
              )}
            </Group>
          )}
        </div>
      )}

      <DryRunHint fileName={fileName} />
    </SectionCard>
  );
}
