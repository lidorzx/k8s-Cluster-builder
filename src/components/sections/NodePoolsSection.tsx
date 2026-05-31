import { useState } from 'react';
import { SectionCard } from '../ui/SectionCard';
import { AddNodepoolModal } from '../ui/AddNodepoolModal';
import { useClusterClassStore } from '../../store/useClusterClassStore';

interface NodePoolsSectionProps {
  stepNumber: number;
  id?: string;
}

export function NodePoolsSection({ stepNumber, id }: NodePoolsSectionProps) {
  const { name, workerPools, addWorkerPool, removeWorkerPool } = useClusterClassStore();
  const [showModal, setShowModal] = useState(false);

  const poolDisplayName = (poolName: string) => poolName || `${name || 'cluster'}-np-…`;

  return (
    <>
      <SectionCard
        stepNumber={stepNumber}
        title="Node pools"
        description={`${workerPools.length} node pool${workerPools.length !== 1 ? 's' : ''}`}
        id={id}
      >
        <div className="space-y-3">
          {/* Pool list */}
          <div className="overflow-hidden rounded-xl border border-ink-200">
            {/* Table header */}
            <div className="flex items-center border-b border-ink-200 bg-ink-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-500">
              <span className="flex-1">Name</span>
              <span className="w-20 text-center">Replicas</span>
              <span className="w-20 text-center">Class</span>
              <span className="w-8" />
            </div>

            {workerPools.map((pool) => (
              <div
                key={pool.id}
                className="flex items-center border-b border-ink-100 px-4 py-2.5 transition-colors last:border-b-0 hover:bg-brand-50/40"
              >
                <span className="flex-1 truncate font-mono text-sm text-ink-800">
                  {poolDisplayName(pool.name)}
                </span>
                <span className="w-20 text-center text-sm text-ink-600">{pool.replicas}</span>
                <span className="w-20 truncate text-center text-sm text-ink-500">{pool.poolClass}</span>
                <div className="flex w-8 justify-end">
                  {workerPools.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWorkerPool(pool.id)}
                      className="text-ink-300 transition-colors hover:text-rose-500"
                      aria-label="Remove pool"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add button */}
          <button type="button" onClick={() => setShowModal(true)} className="ui-btn-outline">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add node pool
          </button>
        </div>
      </SectionCard>

      {showModal && (
        <AddNodepoolModal
          clusterName={name || 'cluster'}
          onAdd={(pool) => addWorkerPool(pool)}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
