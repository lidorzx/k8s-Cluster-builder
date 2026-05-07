import { SectionCard } from '../ui/SectionCard';
import { FormField } from '../ui/FormField';
import { VolumeEditor } from '../ui/VolumeEditor';
import { useClusterClassStore } from '../../store/useClusterClassStore';

const INPUT_CLASS =
  'block w-full text-sm border border-gray-300 focus:border-[#0072c6] focus:outline-none focus:ring-1 focus:ring-[#0072c6] px-3 py-1.5';

interface GeneralSettingsSectionProps {
  stepNumber: number;
  id?: string;
}

export function GeneralSettingsSection({ stepNumber, id }: GeneralSettingsSectionProps) {
  const state = useClusterClassStore();
  const { update, addVolume, removeVolume, updateVolume } = state;
  const isCustom = state.configType === 'custom';

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="General Settings"
      description="Cluster name, release, compute and networking"
      id={id}
    >
      <div>
        <FormField label="Cluster Name" htmlFor="cluster-name" required>
          <input
            id="cluster-name"
            type="text"
            value={state.name}
            onChange={(e) => update({ name: e.target.value })}
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField label="Namespace" htmlFor="namespace" required>
          <input
            id="namespace"
            type="text"
            value={state.namespace}
            onChange={(e) => update({ namespace: e.target.value })}
            placeholder="e.g. namespace-myorg-xxxx"
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField label="Kubernetes Release" htmlFor="k8s-version" required>
          <input
            id="k8s-version"
            type="text"
            value={state.kubernetesVersion}
            onChange={(e) => update({ kubernetesVersion: e.target.value })}
            placeholder="v1.33.6---vmware.1-fips-vkr.2"
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField label="VM Class" htmlFor="vm-class" required>
          <input
            id="vm-class"
            type="text"
            value={state.vmClass}
            onChange={(e) => update({ vmClass: e.target.value })}
            placeholder="best-effort-medium"
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField label="Storage Class" htmlFor="storage-class" required>
          <input
            id="storage-class"
            type="text"
            value={state.storageClass}
            onChange={(e) => update({ storageClass: e.target.value })}
            placeholder="bynet-m01-cl01-...-policy"
            className={INPUT_CLASS}
          />
        </FormField>

        {/* Custom-only fields */}
        {isCustom && (
          <>
            <FormField label="Default Storage Class" htmlFor="default-sc">
              <input
                id="default-sc"
                type="text"
                value={state.defaultStorageClass}
                onChange={(e) => update({ defaultStorageClass: e.target.value })}
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField label="Cluster Class" htmlFor="cluster-class">
              <input
                id="cluster-class"
                type="text"
                value={state.clusterClassName}
                onChange={(e) => update({ clusterClassName: e.target.value })}
                placeholder="builtin-generic-v3.4.0"
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField label="Class Namespace" htmlFor="class-namespace">
              <input
                id="class-namespace"
                type="text"
                value={state.classNamespace}
                onChange={(e) => update({ classNamespace: e.target.value })}
                placeholder="vmware-system-vks-public"
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField label="Pods CIDR" htmlFor="pod-cidr">
              <input
                id="pod-cidr"
                type="text"
                value={state.podCidr}
                onChange={(e) => update({ podCidr: e.target.value })}
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField label="Services CIDR" htmlFor="service-cidr">
              <input
                id="service-cidr"
                type="text"
                value={state.serviceCidr}
                onChange={(e) => update({ serviceCidr: e.target.value })}
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField label="Service Domain" htmlFor="service-domain">
              <input
                id="service-domain"
                type="text"
                value={state.serviceDomain}
                onChange={(e) => update({ serviceDomain: e.target.value })}
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField label="Cluster FQDN" htmlFor="cluster-fqdn">
              <input
                id="cluster-fqdn"
                type="text"
                value={state.endpointFQDNs[0] ?? ''}
                onChange={(e) => update({ endpointFQDNs: [e.target.value] })}
                placeholder="e.g. api.mycluster.local"
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField label="NTP Server" htmlFor="ntp-server">
              <input
                id="ntp-server"
                type="text"
                value={state.ntpServers[0] ?? ''}
                onChange={(e) => update({ ntpServers: [e.target.value] })}
                placeholder="e.g. 10.160.99.12"
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField label="Certificate Rotation" htmlFor="cert-rotation">
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="cert-rotation"
                    type="checkbox"
                    checked={state.certificateRotationEnabled}
                    onChange={(e) => update({ certificateRotationEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Enable Certificate Rotation</span>
                </label>
                {state.certificateRotationEnabled && (
                  <div className="flex items-center gap-2 mt-1">
                    <label htmlFor="cert-days" className="text-sm text-gray-600 whitespace-nowrap">
                      Renewal Days Before Expiry
                    </label>
                    <input
                      id="cert-days"
                      type="number"
                      value={state.certificateRotationDays}
                      onChange={(e) =>
                        update({ certificateRotationDays: parseInt(e.target.value, 10) || 90 })
                      }
                      className={INPUT_CLASS + ' w-24'}
                      min={1}
                    />
                  </div>
                )}
              </div>
            </FormField>

            <FormField label="Volumes" htmlFor="volumes">
              <VolumeEditor
                volumes={state.volumes}
                onAdd={addVolume}
                onRemove={removeVolume}
                onUpdate={updateVolume}
              />
            </FormField>
          </>
        )}
      </div>
    </SectionCard>
  );
}
