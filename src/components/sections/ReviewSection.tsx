import { SectionCard } from '../ui/SectionCard';
import { useClusterClassStore } from '../../store/useClusterClassStore';

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

export function ReviewSection({ stepNumber, id }: ReviewSectionProps) {
  const state = useClusterClassStore();
  const isDefault = state.configType === 'default';

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="Review and Confirm"
      description="Review all the details before you deploy this cluster"
      id={id}
      hideNext
    >
      <p className="text-sm text-gray-500 mb-5">
        Your cluster will be deployed with the following configuration:
      </p>

      {isDefault ? (
        /* ── Default mode: compact VCF-style review ── */
        <div>
          <Group title="Cluster">
            <Row label="Kind" value="Cluster" />
            <Row label="Cluster Name" value={state.name} />
            <Row label="Cluster Class" value={state.clusterClassName} />
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
                    {pool.name || `${state.name}-np-…`}
                  </span>
                </div>
                <div className="px-0">
                  <Row label="Class" value={pool.poolClass} />
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
                    {pool.name || `${state.name}-np-…`}
                  </span>
                </div>
                <Row label="Class" value={pool.poolClass} />
                <Row label="Replicas" value={String(pool.replicas)} />
                <Row label="OS Image" value={pool.osImageName} />
              </div>
            ))}
          </Group>
        </div>
      )}
    </SectionCard>
  );
}
