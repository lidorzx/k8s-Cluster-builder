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
          <div className="border border-gray-200">
            {/* Table header */}
            <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <span className="flex-1">Name</span>
              <span className="w-20 text-center">Replicas</span>
              <span className="w-20 text-center">Class</span>
              <span className="w-8" />
            </div>

            {workerPools.map((pool) => (
              <div
                key={pool.id}
                className="flex items-center px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <span className="flex-1 text-sm font-mono text-gray-800 truncate">
                  {poolDisplayName(pool.name)}
                </span>
                <span className="w-20 text-center text-sm text-gray-600">{pool.replicas}</span>
                <span className="w-20 text-center text-sm text-gray-500 truncate">{pool.poolClass}</span>
                <div className="w-8 flex justify-end">
                  {workerPools.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWorkerPool(pool.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Remove pool"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add button */}
          <div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-4 py-1.5 text-sm text-[#0072c6] border border-[#0072c6] hover:bg-[#f0f7ff] font-medium transition-colors"
            >
              ADD NODE POOL
            </button>
          </div>
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
