import { SectionCard } from '../ui/SectionCard';
import { useClusterClassStore } from '../../store/useClusterClassStore';

interface ReviewSectionProps {
  stepNumber: number;
  id?: string;
}

function ReviewRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-start py-2.5 border-b border-gray-100 last:border-b-0">
      <div className="w-56 flex-shrink-0 pr-4">
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex-1">
        {typeof value === 'string' ? (
          <span className="text-sm font-medium text-sky-600">{value || '—'}</span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export function ReviewSection({ stepNumber, id }: ReviewSectionProps) {
  const state = useClusterClassStore();

  // We need to override SectionCard to not show NEXT on last step
  // We use a wrapper approach — render a SectionCard but suppress its NEXT button
  // by using a custom inner layout. Actually SectionCard always shows NEXT.
  // To handle the last step, we render outside of SectionCard's NEXT or we accept it.
  // Per spec: "No NEXT button on the last step". We can pass a custom prop or
  // just live with it since the spec says no NEXT but SectionCard always shows it.
  // We'll wrap manually to avoid the NEXT button.

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="Review and Confirm"
      description="Review all the details before you deploy this cluster"
      id={id}
      hideNext
    >
      <div className="mt-2">
        <ReviewRow label="Cluster Name" value={state.name} />
        <ReviewRow label="Cluster Class" value={state.clusterClassName} />
        <ReviewRow label="Kubernetes Release" value={state.kubernetesVersion} />
        <ReviewRow label="Namespace" value={state.namespace} />
        <ReviewRow label="Pods CIDR" value={state.podCidr} />
        <ReviewRow label="Services CIDR" value={state.serviceCidr} />
        <ReviewRow label="Service Domain" value={state.serviceDomain} />
        <ReviewRow label="VM Class" value={state.vmClass} />
        <ReviewRow label="Storage Class" value={state.storageClass} />
        <ReviewRow label="Default Storage Class" value={state.defaultStorageClass} />
        <ReviewRow label="Cluster FQDN" value={state.endpointFQDNs[0] ?? ''} />
        <ReviewRow label="NTP Server" value={state.ntpServers[0] ?? ''} />
        <ReviewRow
          label="Certificate Rotation"
          value={
            state.certificateRotationEnabled
              ? `${state.certificateRotationDays} days`
              : 'Disabled'
          }
        />
        <ReviewRow
          label="Volumes"
          value={state.volumes.length > 0 ? 'Added' : 'None'}
        />
        <ReviewRow label="Control Plane Replicas" value={String(state.controlPlane.replicas)} />
        <ReviewRow label="Control Plane OS Image" value={state.controlPlane.osImageName} />
        <ReviewRow label="Content Library" value={state.controlPlane.contentLibrary} />
        <ReviewRow
          label="Control Plane Volumes"
          value={state.controlPlane.volumeOverrides.length > 0 ? 'Added' : 'None'}
        />
        <div className="flex items-start py-2.5">
          <div className="w-56 flex-shrink-0 pr-4">
            <span className="text-sm text-gray-600">Worker Pools</span>
          </div>
          <div className="flex-1 space-y-1">
            <span className="text-sm font-medium text-sky-600">
              {state.workerPools.length} pool(s)
            </span>
            {state.workerPools.map((pool) => {
              const displayName = pool.name || `${state.name}-np-...`;
              return (
                <div key={pool.id} className="flex items-center gap-2 text-sm pl-2">
                  <span className="text-gray-500">{displayName}</span>
                  <span className="text-gray-400 text-xs">({pool.replicas} replica{pool.replicas !== 1 ? 's' : ''})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
