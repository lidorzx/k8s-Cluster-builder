import { SectionCard } from '../ui/SectionCard';
import { FormField } from '../ui/FormField';
import { FieldHint, KubectlBlock } from '../ui/FieldHint';
import { VolumeEditor } from '../ui/VolumeEditor';
import { useClusterClassStore } from '../../store/useClusterClassStore';

const INPUT_CLASS = 'ui-input';

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
          <FieldHint label="How to find your namespace">
            <p>The vSphere Namespace where this cluster will be created. You must have permissions to deploy workloads into it.</p>
            <KubectlBlock command="kubectl get namespaces" />
            <p className="text-gray-500">Or: vSphere UI → Workload Management → Namespaces → copy the name.</p>
          </FieldHint>
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
          <FieldHint label="How to find available releases">
            <p>Lists all Tanzu Kubernetes Releases available on this Supervisor cluster:</p>
            <KubectlBlock command="kubectl get tkr" />
            <p className="text-gray-500">Copy the full name from the <span className="font-mono">NAME</span> column, e.g. <span className="font-mono text-gray-700">v1.33.6---vmware.1-fips-vkr.2</span></p>
          </FieldHint>
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
          <FieldHint label="How to find available VM classes">
            <p>VM classes define the CPU and memory profile for each node. List available ones:</p>
            <KubectlBlock command="kubectl get virtualmachineclasses" />
            <p className="text-gray-500">Common classes: <span className="font-mono text-gray-700">best-effort-small</span>, <span className="font-mono text-gray-700">best-effort-medium</span>, <span className="font-mono text-gray-700">best-effort-large</span></p>
          </FieldHint>
        </FormField>

        <FormField label="Storage Class" htmlFor="storage-class" required>
          <input
            id="storage-class"
            type="text"
            value={state.storageClass}
            onChange={(e) => update({ storageClass: e.target.value })}
            placeholder="e.g. sc-datastore-policy"
            className={INPUT_CLASS}
          />
          <FieldHint label="How to find available storage classes">
            <p>The storage class controls which datastore/policy is used for node disks.</p>
            <KubectlBlock command="kubectl get storageclasses" />
            <p className="text-gray-500">Use the <span className="font-mono">NAME</span> column value.</p>
          </FieldHint>
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

            <FormField label="Service Domain" htmlFor="service-domain">
              <input
                id="service-domain"
                type="text"
                value={state.serviceDomain}
                onChange={(e) => update({ serviceDomain: e.target.value })}
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
              <FieldHint label="What is Pods CIDR?">
                <p>The internal IP range assigned to pods inside the cluster. Must not overlap with your physical network or the Services CIDR.</p>
                <p className="text-gray-500">Default <span className="font-mono text-gray-700">192.168.0.0/16</span> is safe for most environments unless you have conflicting subnets.</p>
              </FieldHint>
            </FormField>

            <FormField label="Services CIDR" htmlFor="service-cidr">
              <input
                id="service-cidr"
                type="text"
                value={state.serviceCidr}
                onChange={(e) => update({ serviceCidr: e.target.value })}
                className={INPUT_CLASS}
              />
              <FieldHint label="What is Services CIDR?">
                <p>The internal IP range for Kubernetes Services (ClusterIP). Must not overlap with Pods CIDR or your physical network.</p>
                <p className="text-gray-500">Default <span className="font-mono text-gray-700">10.96.0.0/12</span> is safe for most environments.</p>
              </FieldHint>
            </FormField>

            <FormField label="Cluster FQDN" htmlFor="cluster-fqdn">
              <input
                id="cluster-fqdn"
                type="text"
                value={state.endpointFQDNs[0] ?? ''}
                onChange={(e) => update({ endpointFQDNs: [e.target.value] })}
                placeholder="e.g. api.mycluster.corp"
                className={INPUT_CLASS}
              />
              <FieldHint label="What is Cluster FQDN and do I need it?">
                <p><strong>Cluster FQDN</strong> is a custom DNS hostname for the Kubernetes API server endpoint (e.g. <span className="font-mono text-gray-700">api.mycluster.corp</span>).</p>
                <p>You only need this if you want a human-readable DNS name for the API endpoint instead of the auto-assigned IP. Leave blank if you don't have a DNS name set up — the cluster will still work fine.</p>
                <p className="text-gray-500">If set, you'll need to create a DNS record pointing this name to the cluster's control plane IP after deployment.</p>
              </FieldHint>
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
              <FieldHint label="What is NTP and where do I find the server?">
                <p>NTP (Network Time Protocol) keeps all cluster nodes' clocks in sync. Skewed clocks can cause certificate and auth failures.</p>
                <p className="text-gray-500">Use your organization's internal NTP server. If you don't have one, you can use <span className="font-mono text-gray-700">pool.ntp.org</span> (requires internet access).</p>
              </FieldHint>
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
              <FieldHint label="What is certificate rotation?">
                <p>Kubernetes components use TLS certificates that expire after 1 year by default. Certificate rotation automatically renews them before they expire, preventing cluster outages.</p>
                <p className="text-gray-500">Recommended for production clusters. The "days before expiry" value controls how early the renewal starts (e.g. 90 = renew when 90 days remain).</p>
              </FieldHint>
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
