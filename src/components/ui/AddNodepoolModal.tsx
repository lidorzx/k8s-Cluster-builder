import { useState } from 'react';
import type { WorkerPool, Volume } from '../../types/cluster';

interface Props {
  clusterName: string;
  onAdd: (pool: Omit<WorkerPool, 'id'>) => void;
  onClose: () => void;
}

const INPUT =
  'block w-full text-sm border border-gray-300 focus:border-[#0072c6] focus:outline-none focus:ring-1 focus:ring-[#0072c6] px-3 py-1.5 bg-white';

function genSuffix(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function genVolName(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `vol-${s}`;
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-start py-2.5 border-b border-gray-100 last:border-b-0">
      <div className="w-48 flex-shrink-0 pt-1.5 pr-4">
        <span className="text-sm text-gray-700">{label}</span>
        {optional && <span className="block text-xs text-gray-400 mt-0.5">(Optional)</span>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function AddNodepoolModal({ clusterName, onAdd, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(() => `${clusterName}-nodepool-${genSuffix()}`);
  const [poolClass, setPoolClass] = useState('node-pool');
  const [replicas, setReplicas] = useState(1);
  const [vmClass, setVmClass] = useState('');
  const [storageClass, setStorageClass] = useState('');
  const [osImageName, setOsImageName] = useState('photon');
  const [contentLibrary, setContentLibrary] = useState('');
  const [showVolumes, setShowVolumes] = useState(false);
  const [volumes, setVolumes] = useState<Volume[]>([]);

  const addVolume = () =>
    setVolumes((v) => [
      ...v,
      { id: genId(), name: genVolName(), mountPath: '', storageClass: '', capacity: '' },
    ]);

  const removeVolume = (id: string) => setVolumes((v) => v.filter((vol) => vol.id !== id));

  const updateVolume = (id: string, partial: Partial<Volume>) =>
    setVolumes((v) => v.map((vol) => (vol.id === id ? { ...vol, ...partial } : vol)));

  const handleAdd = () => {
    onAdd({
      name,
      poolClass,
      replicas,
      osImageName,
      contentLibrary,
      vmClass: vmClass || undefined,
      storageClass: storageClass || undefined,
      volumes: volumes.length > 0 ? volumes : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white w-[600px] max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-900">Add Node Pool</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-6 py-3 border-b border-gray-200 bg-white gap-0">
          {(['Configuration', 'Review and Confirm'] as const).map((label, i) => {
            const stepNum = i + 1;
            const active = step === stepNum;
            const done = step > stepNum;
            return (
              <div key={label} className="flex items-center">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      active
                        ? 'bg-sky-600 text-white'
                        : done
                        ? 'bg-sky-100 text-[#0072c6] border border-sky-300'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      active ? 'text-sky-700' : done ? 'text-sky-500' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < 1 && (
                  <div className="w-8 h-px bg-gray-300 mx-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 1 && (
            <div>
              <Field label="Name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={INPUT}
                />
              </Field>

              <Field label="Class">
                <input
                  type="text"
                  value={poolClass}
                  onChange={(e) => setPoolClass(e.target.value)}
                  placeholder="node-pool"
                  className={INPUT}
                />
              </Field>

              <Field label="Replicas">
                <input
                  type="number"
                  min={0}
                  value={replicas}
                  onChange={(e) => setReplicas(parseInt(e.target.value, 10) || 1)}
                  className={INPUT}
                />
              </Field>

              <Field label="VM Class" optional>
                <input
                  type="text"
                  value={vmClass}
                  onChange={(e) => setVmClass(e.target.value)}
                  placeholder="best-effort-medium"
                  className={INPUT}
                />
              </Field>

              <Field label="Storage Class" optional>
                <input
                  type="text"
                  value={storageClass}
                  onChange={(e) => setStorageClass(e.target.value)}
                  className={INPUT}
                />
              </Field>

              <Field label="OS Image Name">
                <input
                  type="text"
                  value={osImageName}
                  onChange={(e) => setOsImageName(e.target.value)}
                  placeholder="photon"
                  className={INPUT}
                />
              </Field>

              <Field label="Content Library" optional>
                <input
                  type="text"
                  value={contentLibrary}
                  onChange={(e) => setContentLibrary(e.target.value)}
                  className={INPUT}
                />
              </Field>

              {/* Volumes toggle */}
              <div className="mt-4 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowVolumes(!showVolumes)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Volumes</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400">(Optional)</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${showVolumes ? '' : '-rotate-90'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {showVolumes && (
                  <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                    {volumes.map((vol) => (
                      <div key={vol.id} className="mb-3 border border-gray-200 bg-white p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-gray-500">{vol.name}</span>
                          <button
                            type="button"
                            onClick={() => removeVolume(vol.id)}
                            className="text-gray-400 hover:text-red-500 text-xs transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={vol.mountPath}
                            onChange={(e) => updateVolume(vol.id, { mountPath: e.target.value })}
                            placeholder="Mount path (e.g. /var/lib/kubelet)"
                            className={INPUT}
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={vol.storageClass}
                              onChange={(e) => updateVolume(vol.id, { storageClass: e.target.value })}
                              placeholder="Storage class"
                              className={INPUT}
                            />
                            <input
                              type="text"
                              value={vol.capacity}
                              onChange={(e) => updateVolume(vol.id, { capacity: e.target.value })}
                              placeholder="Capacity (e.g. 20Gi)"
                              className={`${INPUT} w-36`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addVolume}
                      className="text-xs text-[#0072c6] border border-[#0072c6] hover:bg-[#f0f7ff] px-3 py-1 font-medium transition-colors"
                    >
                      + ADD VOLUME
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Review the node pool configuration before adding.</p>
              <div className="border border-gray-200">
                {[
                  { label: 'Name', value: name },
                  { label: 'Class', value: poolClass },
                  { label: 'Replicas', value: String(replicas) },
                  { label: 'VM Class', value: vmClass || '—' },
                  { label: 'Storage Class', value: storageClass || '—' },
                  { label: 'OS Image', value: osImageName },
                  { label: 'Content Library', value: contentLibrary || '—' },
                  { label: 'Volumes', value: volumes.length > 0 ? `${volumes.length} volume(s)` : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex border-b border-gray-100 last:border-b-0">
                    <div className="w-40 flex-shrink-0 px-4 py-2.5 bg-gray-50 text-sm text-gray-600 font-medium">{label}</div>
                    <div className="flex-1 px-4 py-2.5 text-sm text-gray-800">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-gray-700 border border-gray-300 hover:bg-gray-100 font-medium transition-colors"
          >
            CANCEL
          </button>
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-1.5 text-sm text-gray-700 border border-gray-300 hover:bg-gray-100 font-medium transition-colors"
            >
              BACK
            </button>
          )}
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-1.5 text-sm text-white bg-[#0072c6] hover:bg-[#005fa3] font-medium transition-colors"
            >
              NEXT
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-1.5 text-sm text-white bg-[#0072c6] hover:bg-[#005fa3] font-medium transition-colors"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
