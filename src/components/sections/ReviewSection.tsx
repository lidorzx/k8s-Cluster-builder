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
    <div className="flex items-start border-b border-ink-100 px-3 py-2 last:border-b-0">
      <div className="w-48 flex-shrink-0 pr-4">
        <span className="text-sm text-ink-500">{label}</span>
      </div>
      <span className="break-all text-sm font-medium text-ink-800">{value || '—'}</span>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">{title}</div>
      <div className="overflow-hidden rounded-xl border border-ink-100 bg-ink-50/40">{children}</div>
    </div>
  );
}

function DryRunHint({ fileName }: { fileName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-brand-100 bg-brand-50/60">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-brand-100/50"
      >
        <svg className="h-3.5 w-3.5 flex-shrink-0 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="flex-1 text-xs font-medium text-brand-700">How to validate before applying</span>
        <svg className={`h-3 w-3 text-brand-600 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="space-y-2.5 border-t border-brand-100 px-3 py-3">
          <p className="text-xs text-ink-600">
            Run a <strong>client-side dry-run</strong> to catch YAML/schema errors without creating anything:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-ink-900 px-3 py-2 font-mono text-xs leading-relaxed text-emerald-300">{`kubectl apply --dry-run=client -f ${fileName}`}</pre>
          <p className="text-xs text-ink-600">
            For a <strong>server-side dry-run</strong> (checks namespace, ClusterClass present, etc.):
          </p>
          <pre className="overflow-x-auto rounded-lg bg-ink-900 px-3 py-2 font-mono text-xs leading-relaxed text-emerald-300">{`kubectl apply --dry-run=server -f ${fileName}`}</pre>
          <p className="text-xs text-ink-400">Server-side requires a connection to the VCF Supervisor cluster and proper RBAC.</p>
        </div>
      )}
    </div>
  );
}

// A dark command block with a one-click copy button.
function Cmd({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg bg-ink-900 px-3 py-2 pr-14 font-mono text-xs leading-relaxed text-emerald-300">{text}</pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-1.5 top-1.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[0.65rem] font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

// Day-2: how to retrieve and use the guest cluster's kubeconfig. (The builder
// can't fetch a real kubeconfig — the cluster doesn't exist yet — so it hands
// you the exact commands, pre-filled with your cluster name + namespace.)
function KubeconfigHint({ name, namespace }: { name: string; namespace: string }) {
  const [open, setOpen] = useState(false);
  const cn = name || 'my-cluster';
  const ns = namespace || '<namespace>';
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/60">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-emerald-100/50"
      >
        <svg className="h-3.5 w-3.5 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        <span className="flex-1 text-xs font-medium text-emerald-700">Get the kubeconfig & connect (after the cluster is Ready)</span>
        <svg className={`h-3 w-3 text-emerald-600 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="space-y-2.5 border-t border-emerald-200 px-3 py-3">
          <p className="text-xs text-ink-600">
            1. Confirm the cluster has finished provisioning (look for <span className="font-mono text-ink-700">Provisioned</span>):
          </p>
          <Cmd text={`kubectl get cluster ${cn} -n ${ns}`} />
          <p className="text-xs text-ink-600">
            2. Export its kubeconfig from the Supervisor (the secret is named <span className="font-mono text-ink-700">{cn}-kubeconfig</span>):
          </p>
          <Cmd text={`kubectl get secret ${cn}-kubeconfig -n ${ns} \\\n  -o jsonpath='{.data.value}' | base64 -d > ${cn}.kubeconfig`} />
          <p className="text-xs text-ink-600">3. Use it:</p>
          <Cmd text={`export KUBECONFIG="$PWD/${cn}.kubeconfig"\nkubectl get nodes`} />
          <p className="text-xs text-ink-600">
            Alternatively, log in with the vSphere plugin (prompts for a password, no secret export needed):
          </p>
          <Cmd text={`kubectl vsphere login --server=<SUPERVISOR-IP> \\\n  --tanzu-kubernetes-cluster-name ${cn} \\\n  --tanzu-kubernetes-cluster-namespace ${ns} \\\n  --vsphere-username <USERNAME> --insecure-skip-tls-verify`} />
          <p className="text-xs text-ink-400">
            Run these against the VCF Supervisor (the same context you applied the Cluster to).
          </p>
        </div>
      )}
    </div>
  );
}

export function ReviewSection({ stepNumber, id }: ReviewSectionProps) {
  const state = useClusterClassStore();
  const isDefault = state.configType === 'default';
  const { errors, warnings } = validateState(state);
  const fileName = `${state.name || 'cluster'}-cluster.yaml`;

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="Review and Confirm"
      description="Review all the details before you deploy this cluster"
      id={id}
      hideNext
    >
      {/* Validation status */}
      {errors.length > 0 ? (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
          <div className="mb-2 flex items-center gap-2">
            <svg className="h-4 w-4 flex-shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span className="text-sm font-semibold text-rose-700">{errors.length} issue{errors.length > 1 ? 's' : ''} to fix before applying</span>
          </div>
          <ul className="space-y-1">
            {errors.map((e, i) => (
              <li key={`${e.field}-${i}`} className="flex items-center gap-1.5 text-xs text-rose-700">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" />
                <strong>{e.field}</strong>: {e.message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <svg className="h-4 w-4 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold text-emerald-700">Looks valid — ready to copy or download</span>
        </div>
      )}

      {/* Non-blocking warnings */}
      {warnings.length > 0 && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="mb-2 flex items-center gap-2">
            <svg className="h-4 w-4 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-amber-700">{warnings.length} thing{warnings.length > 1 ? 's' : ''} worth checking</span>
          </div>
          <ul className="space-y-1">
            {warnings.map((w, i) => (
              <li key={`${w.field}-${i}`} className="flex items-center gap-1.5 text-xs text-amber-700">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                <strong>{w.field}</strong>: {w.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mb-5 text-sm text-ink-500">Your cluster will be deployed with the following configuration:</p>

      {isDefault ? (
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
              <div key={pool.id} className="border-b border-ink-100 last:border-b-0">
                <div className="border-b border-ink-100 bg-ink-50 px-3 py-1.5">
                  <span className="font-mono text-xs font-semibold text-ink-600">
                    {pool.name || `${state.name}-nodepool-…`}
                  </span>
                </div>
                <Row label="Replicas" value={String(pool.replicas)} />
                <Row label="VM Class" value={state.vmClass} />
                <Row label="Storage Class" value={state.storageClass} />
                <Row label="OS Image" value={pool.osImageName} />
              </div>
            ))}
          </Group>
        </div>
      ) : (
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
              <div key={pool.id} className="border-b border-ink-100 last:border-b-0">
                <div className="border-b border-ink-100 bg-ink-50 px-3 py-1.5">
                  <span className="font-mono text-xs font-semibold text-ink-600">
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
                <div key={r.id} className="border-b border-ink-100 last:border-b-0">
                  <div className="border-b border-ink-100 bg-ink-50 px-3 py-1.5">
                    <span className="font-mono text-xs font-semibold text-ink-600">
                      trust · {r.registryHost || `registry-${i + 1}`}
                    </span>
                  </div>
                  <Row label="Certificate source" value={r.mode === 'paste' ? 'Pasted (Secret generated)' : 'Existing secret'} />
                  <Row label="Secret" value={r.mode === 'paste' ? state.registryTrustSecretName : r.secretName} />
                  <Row label="Data key" value={r.mode === 'paste' ? r.caKey : r.secretKey} />
                </div>
              ))}
              {state.registryAuth.enabled && (
                <div className="border-b border-ink-100 last:border-b-0">
                  <div className="border-b border-ink-100 bg-ink-50 px-3 py-1.5">
                    <span className="font-mono text-xs font-semibold text-ink-600">auth · pull secret (guest cluster)</span>
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
      <KubeconfigHint name={state.name} namespace={state.namespace} />
    </SectionCard>
  );
}
