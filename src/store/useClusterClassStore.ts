import { create } from 'zustand';
import type { ClusterFormState, Volume, WorkerPool } from '../types/cluster';
import { defaultState } from '../lib/capv-defaults';

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function genVolName(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `vol-${s}`;
}


interface ClusterActions {
  update: (partial: Partial<ClusterFormState>) => void;
  updateControlPlane: (partial: Partial<ClusterFormState['controlPlane']>) => void;
  addWorkerPool: (pool?: Partial<Omit<WorkerPool, 'id'>>) => void;
  removeWorkerPool: (id: string) => void;
  updateWorkerPool: (id: string, partial: Partial<WorkerPool>) => void;
  addVolume: () => void;
  removeVolume: (id: string) => void;
  updateVolume: (id: string, partial: Partial<Volume>) => void;
  addCpVolume: () => void;
  removeCpVolume: (id: string) => void;
  updateCpVolume: (id: string, partial: Partial<Volume>) => void;
  addPoolVolume: (poolId: string) => void;
  removePoolVolume: (poolId: string, volumeId: string) => void;
  updatePoolVolume: (poolId: string, volumeId: string, partial: Partial<Volume>) => void;
  resetToDefaults: () => void;
}

type StoreState = ClusterFormState & ClusterActions;

export const useClusterClassStore = create<StoreState>((set) => ({
  ...defaultState,

  update: (partial) => set((state) => ({ ...state, ...partial })),

  updateControlPlane: (partial) =>
    set((state) => ({
      controlPlane: { ...state.controlPlane, ...partial },
    })),

  addWorkerPool: (pool?) =>
    set((state) => ({
      workerPools: [
        ...state.workerPools,
        {
          id: genId(),
          name: pool?.name ?? '',
          poolClass: pool?.poolClass ?? 'node-pool',
          replicas: pool?.replicas ?? 1,
          osImageName: pool?.osImageName ?? 'photon',
          contentLibrary: pool?.contentLibrary ?? '',
          vmClass: pool?.vmClass,
          storageClass: pool?.storageClass,
          volumes: pool?.volumes,
        },
      ],
    })),

  removeWorkerPool: (id) =>
    set((state) => ({
      workerPools: state.workerPools.filter((p) => p.id !== id),
    })),

  updateWorkerPool: (id, partial) =>
    set((state) => ({
      workerPools: state.workerPools.map((p) =>
        p.id === id ? { ...p, ...partial } : p
      ),
    })),

  addVolume: () =>
    set((state) => ({
      volumes: [
        ...state.volumes,
        {
          id: genId(),
          name: genVolName(),
          mountPath: '',
          storageClass: '',
          capacity: '',
        },
      ],
    })),

  removeVolume: (id) =>
    set((state) => ({
      volumes: state.volumes.filter((v) => v.id !== id),
    })),

  updateVolume: (id, partial) =>
    set((state) => ({
      volumes: state.volumes.map((v) => (v.id === id ? { ...v, ...partial } : v)),
    })),

  addCpVolume: () =>
    set((state) => ({
      controlPlane: {
        ...state.controlPlane,
        volumeOverrides: [
          ...state.controlPlane.volumeOverrides,
          {
            id: genId(),
            name: genVolName(),
            mountPath: '',
            storageClass: '',
            capacity: '',
          },
        ],
      },
    })),

  removeCpVolume: (id) =>
    set((state) => ({
      controlPlane: {
        ...state.controlPlane,
        volumeOverrides: state.controlPlane.volumeOverrides.filter((v) => v.id !== id),
      },
    })),

  updateCpVolume: (id, partial) =>
    set((state) => ({
      controlPlane: {
        ...state.controlPlane,
        volumeOverrides: state.controlPlane.volumeOverrides.map((v) =>
          v.id === id ? { ...v, ...partial } : v
        ),
      },
    })),

  addPoolVolume: (poolId) =>
    set((state) => ({
      workerPools: state.workerPools.map((p) =>
        p.id === poolId
          ? {
              ...p,
              volumes: [
                ...(p.volumes ?? []),
                { id: genId(), name: genVolName(), mountPath: '', storageClass: '', capacity: '' },
              ],
            }
          : p
      ),
    })),

  removePoolVolume: (poolId, volumeId) =>
    set((state) => ({
      workerPools: state.workerPools.map((p) =>
        p.id === poolId
          ? { ...p, volumes: (p.volumes ?? []).filter((v) => v.id !== volumeId) }
          : p
      ),
    })),

  updatePoolVolume: (poolId, volumeId, partial) =>
    set((state) => ({
      workerPools: state.workerPools.map((p) =>
        p.id === poolId
          ? {
              ...p,
              volumes: (p.volumes ?? []).map((v) =>
                v.id === volumeId ? { ...v, ...partial } : v
              ),
            }
          : p
      ),
    })),

  resetToDefaults: () => set({ ...defaultState }),
}));
