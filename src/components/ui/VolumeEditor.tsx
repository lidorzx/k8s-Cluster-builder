import type { Volume } from '../../types/cluster';

const INPUT_CLASS =
  'block w-full text-sm border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 px-3 py-1.5';

interface VolumeEditorProps {
  volumes: Volume[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, partial: Partial<Volume>) => void;
}

export function VolumeEditor({ volumes, onAdd, onRemove, onUpdate }: VolumeEditorProps) {
  return (
    <div className="space-y-2">
      {volumes.length === 0 ? (
        <p className="text-sm italic text-gray-400">No volumes configured.</p>
      ) : (
        volumes.map((vol) => (
          <div key={vol.id} className="border border-gray-200 p-3 bg-gray-50 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-gray-500">{vol.name}</span>
              <button
                type="button"
                onClick={() => onRemove(vol.id)}
                className="text-gray-400 hover:text-red-500 transition-colors text-sm leading-none"
                aria-label="Remove volume"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Name</label>
                <input
                  type="text"
                  value={vol.name}
                  onChange={(e) => onUpdate(vol.id, { name: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="vol-XXXX"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Mount Path</label>
                <input
                  type="text"
                  value={vol.mountPath}
                  onChange={(e) => onUpdate(vol.id, { mountPath: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="/var/lib/containerd"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Storage Class</label>
                <input
                  type="text"
                  value={vol.storageClass}
                  onChange={(e) => onUpdate(vol.id, { storageClass: e.target.value })}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Capacity</label>
                <input
                  type="text"
                  value={vol.capacity}
                  onChange={(e) => onUpdate(vol.id, { capacity: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder="20Gi"
                />
              </div>
            </div>
          </div>
        ))
      )}
      <div className="pt-1">
        <button
          type="button"
          onClick={onAdd}
          className="px-4 py-1.5 text-sm text-sky-700 border border-sky-600 hover:bg-sky-50 font-medium transition-colors"
        >
          ADD VOLUME
        </button>
      </div>
    </div>
  );
}
