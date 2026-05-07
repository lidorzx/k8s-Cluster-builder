import { useState } from 'react';
import { SectionCard } from '../ui/SectionCard';
import { FormField } from '../ui/FormField';
import { VolumeEditor } from '../ui/VolumeEditor';
import { useClusterClassStore } from '../../store/useClusterClassStore';

const INPUT_CLASS =
  'block w-full text-sm border border-gray-300 focus:border-[#0072c6] focus:outline-none focus:ring-1 focus:ring-[#0072c6] px-3 py-1.5';

interface ControlPlaneSectionProps {
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
        className="flex items-center gap-1 text-xs text-[#0072c6] hover:text-sky-800 transition-colors"
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
        <div className="mt-2 border border-sky-200 bg-sky-50 p-3">
          <p className="text-xs text-gray-600 mb-2">
            Run this on the VCF Supervisor cluster:
          </p>
          <pre className="text-xs font-mono bg-gray-900 text-green-400 px-3 py-2 overflow-x-auto leading-relaxed">{`kubectl get contentlibraries -A`}</pre>
          <p className="text-xs text-gray-500 mt-2">
            The <span className="font-mono">NAME</span> column contains the ID (e.g.{' '}
            <span className="font-mono text-gray-700">cl-9677891d7c087127c</span>).
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Alternatively: vSphere UI → Menu → Content Libraries → select library → copy the ID from the URL.
          </p>
        </div>
      )}
    </div>
  );
}

export function ControlPlaneSection({ stepNumber, id }: ControlPlaneSectionProps) {
  const { configType, controlPlane, updateControlPlane, addCpVolume, removeCpVolume, updateCpVolume } =
    useClusterClassStore();
  const isCustom = configType === 'custom';

  return (
    <SectionCard
      stepNumber={stepNumber}
      title="Control plane"
      description="Define the topology of the cluster controller"
      id={id}
    >
      <div>
        <FormField label="Replicas" htmlFor="cp-replicas" required>
          <div className="flex gap-4 pt-1">
            {([1, 3, 5] as const).map((n) => (
              <label key={n} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="cp-replicas"
                  value={n}
                  checked={controlPlane.replicas === n}
                  onChange={() => updateControlPlane({ replicas: n })}
                  className="w-4 h-4 text-blue-600 border-gray-300"
                />
                <span className="text-sm text-gray-700">{n}</span>
              </label>
            ))}
          </div>
        </FormField>

        <FormField
          label="OS Image"
          htmlFor="cp-os-image"
          hint="e.g. photon, ubuntu"
        >
          <input
            id="cp-os-image"
            type="text"
            value={controlPlane.osImageName}
            onChange={(e) => updateControlPlane({ osImageName: e.target.value })}
            placeholder="photon"
            className={INPUT_CLASS}
          />
        </FormField>

        <FormField
          label="Content Library ID"
          htmlFor="cp-content-library"
          hint="The content library ID containing the OS image (run.tanzu.vmware.com/resolve-os-image)"
        >
          <input
            id="cp-content-library"
            type="text"
            value={controlPlane.contentLibrary}
            onChange={(e) => updateControlPlane({ contentLibrary: e.target.value })}
            placeholder="cl-9677891d7c087127c"
            className={INPUT_CLASS}
          />
          <ContentLibraryHint />
        </FormField>

        {isCustom && (
          <FormField label="Volumes" htmlFor="cp-volumes">
            <VolumeEditor
              volumes={controlPlane.volumeOverrides}
              onAdd={addCpVolume}
              onRemove={removeCpVolume}
              onUpdate={updateCpVolume}
            />
          </FormField>
        )}
      </div>
    </SectionCard>
  );
}
