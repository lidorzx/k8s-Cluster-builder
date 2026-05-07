import { SectionCard } from '../ui/SectionCard';
import { FormField } from '../ui/FormField';
import { FieldHint, KubectlBlock } from '../ui/FieldHint';
import { useClusterClassStore } from '../../store/useClusterClassStore';
import { useState } from 'react';

const INPUT =
  'block w-full text-sm border border-gray-300 focus:border-[#0072c6] focus:outline-none focus:ring-1 focus:ring-[#0072c6] px-3 py-1.5';

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
        className="flex items-center gap-1 text-xs text-[#0072c6] hover:underline transition-colors"
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
        <div className="mt-2 border border-[#b8d9f5] bg-[#f0f7ff] p-3">
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
  const { name, namespace, vmClass, storageClass, controlPlane, update, updateControlPlane } =
    useClusterClassStore();

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="Cluster Settings"
      description="Essential settings for your cluster"
      id={id}
    >
      <div>
        <FormField label="Cluster Name" htmlFor="d-name" required>
          <input
            id="d-name"
            type="text"
            value={name}
            onChange={(e) => update({ name: e.target.value })}
            className={INPUT}
          />
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
