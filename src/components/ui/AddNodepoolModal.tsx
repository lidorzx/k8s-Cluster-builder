import { useState } from 'react';
import type { WorkerPool, Volume } from '../../types/cluster';

interface Props {
  clusterName: string;
  onAdd: (pool: Omit<WorkerPool, 'id'>) => void;
  onClose: () => void;
}

const INPUT = 'ui-input';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Dialog */}
      <div className="relative flex max-h-[90vh] w-[600px] flex-col overflow-hidden rounded-2xl bg-white shadow-lift animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 bg-white px-6 py-4">
          <h2 className="text-base font-semibold text-ink-900">Add Node Pool</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 border-b border-ink-100 bg-ink-50/50 px-6 py-3">
          {(['Configuration', 'Review and Confirm'] as const).map((label, i) => {
            const stepNum = i + 1;
            const active = step === stepNum;
            const done = step > stepNum;
            return (
              <div key={label} className="flex items-center">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      active
                        ? 'bg-brand-gradient text-white shadow-glow'
                        : done
                        ? 'border border-brand-300 bg-brand-100 text-brand-600'
                        : 'bg-ink-200 text-ink-500'
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      active ? 'text-brand-700' : done ? 'text-brand-500' : 'text-ink-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < 1 && <div className="mx-2 h-px w-8 bg-ink-200" />}
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
                      className="inline-flex items-center gap-1 rounded-lg border border-brand-300 px-3 py-1 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-50"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add volume
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="mb-4 text-sm text-ink-500">Review the node pool configuration before adding.</p>
              <div className="overflow-hidden rounded-xl border border-ink-200">
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
                  <div key={label} className="flex border-b border-ink-100 last:border-b-0">
                    <div className="w-40 flex-shrink-0 bg-ink-50 px-4 py-2.5 text-sm font-medium text-ink-600">{label}</div>
                    <div className="flex-1 break-all px-4 py-2.5 text-sm text-ink-800">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-ink-100 bg-ink-50/50 px-6 py-3">
          <button type="button" onClick={onClose} className="ui-btn-ghost">
            Cancel
          </button>
          {step === 2 && (
            <button type="button" onClick={() => setStep(1)} className="ui-btn-ghost">
              Back
            </button>
          )}
          {step === 1 ? (
            <button type="button" onClick={() => setStep(2)} className="ui-btn-primary">
              Next
            </button>
          ) : (
            <button type="button" onClick={handleAdd} className="ui-btn-primary">
              Add pool
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
