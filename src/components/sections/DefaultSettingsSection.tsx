import { SectionCard } from '../ui/SectionCard';
import { FormField } from '../ui/FormField';
import { FieldHint, KubectlBlock } from '../ui/FieldHint';
import { RegenerateButton } from '../ui/RegenerateButton';
import { useClusterClassStore } from '../../store/useClusterClassStore';
import { useState } from 'react';

const INPUT = 'ui-input';

interface Props {
  stepNumber: number;
  id?: string;
}

function ContentLibraryHint() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-brand-600 hover:underline transition-colors"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        How to find your Content Library ID
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="mt-2 border border-brand-200 bg-brand-50 p-3">
          <p className="text-xs text-gray-600 mb-2">Run this on the VCF Supervisor cluster:</p>
          <pre className="text-xs font-mono bg-gray-900 text-green-400 px-3 py-2 overflow-x-auto">{`kubectl get contentlibraries -A`}</pre>
          <p className="text-xs text-gray-500 mt-1.5">
            The <span className="font-mono">NAME</span> column is the ID (e.g. <span className="font-mono text-gray-700">cl-9677891d7c087127c</span>).
            Or: vSphere UI → Menu → Content Libraries → copy ID from URL.
          </p>
        </div>
      )}
    </div>
  );
}

export function DefaultSettingsSection({ stepNumber, id }: Props) {
  const {
    name, namespace, vmClass, storageClass, kubernetesVersion,
    controlPlane, workerPools, update, updateControlPlane, updateWorkerPool, regenerateName,
  } = useClusterClassStore();

  const defaultPool = workerPools[0];

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="Cluster Settings"
      description="Essential settings for your cluster"
      id={id}
    >
      <div>
        <FormField label="Cluster Name" htmlFor="d-name" required>
          <div className="flex items-stretch gap-2">
            <input
              id="d-name"
              type="text"
              value={name}
              onChange={(e) => update({ name: e.target.value })}
              className={INPUT}
            />
            <RegenerateButton onClick={regenerateName} />
          </div>
        </FormField>

        <FormField label="Namespace" htmlFor="d-namespace" required>
          <input
            id="d-namespace"
            type="text"
            value={namespace}
            onChange={(e) => update({ namespace: e.target.value })}
            placeholder="e.g. namespace-myorg-xxxx"
            className={INPUT}
          />
          <FieldHint label="How to find your namespace">
            <p>The vSphere Namespace where this cluster will be created.</p>
            <KubectlBlock command="kubectl get namespaces" />
            <p className="text-gray-500">Or: vSphere UI → Workload Management → Namespaces.</p>
          </FieldHint>
        </FormField>

        <FormField label="Kubernetes Release" htmlFor="d-k8s" required>
          <input
            id="d-k8s"
            type="text"
            value={kubernetesVersion}
            onChange={(e) => update({ kubernetesVersion: e.target.value })}
            placeholder="v1.33.6---vmware.1-fips-vkr.2"
            className={INPUT}
          />
          <FieldHint label="How to find available releases">
            <p>Lists all Tanzu Kubernetes Releases available on this Supervisor cluster:</p>
            <KubectlBlock command="kubectl get tkr" />
            <p className="text-gray-500">Copy the full name from the <span className="font-mono">NAME</span> column.</p>
          </FieldHint>
        </FormField>

        <FormField label="VM Class" htmlFor="d-vmclass" required>
          <input
            id="d-vmclass"
            type="text"
            value={vmClass}
            onChange={(e) => update({ vmClass: e.target.value })}
            placeholder="best-effort-medium"
            className={INPUT}
          />
          <FieldHint label="How to find available VM classes">
            <p>VM classes define CPU and memory for each node. List available ones:</p>
            <KubectlBlock command="kubectl get virtualmachineclasses" />
          </FieldHint>
        </FormField>

        <FormField label="Storage Class" htmlFor="d-sc" required>
          <input
            id="d-sc"
            type="text"
            value={storageClass}
            onChange={(e) => update({ storageClass: e.target.value })}
            placeholder="e.g. sc-datastore-policy"
            className={INPUT}
          />
          <FieldHint label="How to find available storage classes">
            <p>Controls which datastore/policy is used for node disks.</p>
            <KubectlBlock command="kubectl get storageclasses" />
          </FieldHint>
        </FormField>

        <FormField label="Control Plane Nodes" htmlFor="d-cp-replicas" required>
          <div className="flex gap-4 pt-1">
            {([1, 3, 5] as const).map((n) => (
              <label key={n} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="d-cp-replicas"
                  value={n}
                  checked={controlPlane.replicas === n}
                  onChange={() => updateControlPlane({ replicas: n })}
                  className="w-4 h-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">{n}</span>
              </label>
            ))}
          </div>
          <FieldHint label="How many control plane nodes do I need?">
            <p><strong>1</strong> — Dev/test only. No HA; cluster goes down if this node fails.</p>
            <p><strong>3</strong> — Recommended for production. Tolerates 1 node failure.</p>
            <p><strong>5</strong> — High availability. Tolerates 2 node failures.</p>
          </FieldHint>
        </FormField>

        {defaultPool && (
          <FormField label="Worker Node Replicas" htmlFor="d-np-replicas" required>
            <input
              id="d-np-replicas"
              type="number"
              min={1}
              value={defaultPool.replicas}
              onChange={(e) =>
                updateWorkerPool(defaultPool.id, { replicas: parseInt(e.target.value, 10) || 1 })
              }
              className={INPUT + ' w-28'}
            />
            <p className="mt-1 text-xs text-gray-400">Number of worker nodes in the default node pool</p>
          </FormField>
        )}

        {defaultPool && (
          <FormField label="Worker VM Class" htmlFor="d-np-vmclass">
            <input
              id="d-np-vmclass"
              type="text"
              value={defaultPool.vmClass ?? ''}
              onChange={(e) => updateWorkerPool(defaultPool.id, { vmClass: e.target.value })}
              placeholder="inherits cluster VM Class"
              className={INPUT}
            />
            <p className="mt-1 text-xs text-gray-400">
              Optional. Overrides the cluster-wide VM Class for worker nodes only. Leave blank to
              use the VM Class above for both control plane and workers.
            </p>
            <FieldHint label="How to find available VM classes">
              <p>VM classes define CPU and memory for each node. List available ones:</p>
              <KubectlBlock command="kubectl get virtualmachineclasses" />
            </FieldHint>
          </FormField>
        )}

        <FormField label="OS Image" htmlFor="d-os" hint="e.g. photon, ubuntu">
          <input
            id="d-os"
            type="text"
            value={controlPlane.osImageName}
            onChange={(e) => updateControlPlane({ osImageName: e.target.value })}
            placeholder="photon"
            className={INPUT}
          />
        </FormField>

        <FormField
          label="Content Library ID"
          htmlFor="d-cl"
          hint="The content library containing the OS image"
        >
          <input
            id="d-cl"
            type="text"
            value={controlPlane.contentLibrary}
            onChange={(e) => updateControlPlane({ contentLibrary: e.target.value })}
            placeholder="cl-9677891d7c087127c"
            className={INPUT}
          />
          <ContentLibraryHint />
        </FormField>
      </div>
    </SectionCard>
  );
}
