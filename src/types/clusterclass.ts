export interface MetaState {
  name: string;
  namespace: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  kubernetesVersion: string;
}

export interface InfraState {
  vcenterServer: string;
  datacenter: string;
  cluster: string;
  resourcePool: string;
  datastore: string;
  folder: string;
  template: string;
  cloningMode: 'linkedClone' | 'fullClone';
  credentialsSecret: string;
  thumbprint: string;
  storagePolicy: string;
}

export interface ControlPlaneState {
  replicas: 1 | 3 | 5;
  cpuCores: number;
  memoryMiB: number;
  diskGiB: number;
  vipAddress: string;
  vipProvider: 'kube-vip' | 'nsx-lb' | 'external';
  extraApiServerArgs: Record<string, string>;
  extraEtcdArgs: Record<string, string>;
  auditLogging: boolean;
}

export interface NodeTaint {
  key: string;
  value: string;
  effect: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';
}

export interface WorkerPool {
  id: string;
  name: string;
  minReplicas: number;
  maxReplicas: number;
  cpuCores: number;
  memoryMiB: number;
  diskGiB: number;
  templateOverride: string;
  nodeLabels: Record<string, string>;
  taints: NodeTaint[];
  gpuWorker: boolean;
}

export interface NetworkState {
  portgroup: string;
  dhcp: boolean;
  podCidr: string;
  serviceCidr: string;
  cni: 'antrea' | 'calico' | 'cilium' | 'none';
  nsxEnabled: boolean;
  nsxManagerUrl: string;
  nsxT1Router: string;
  nsxTransportZone: string;
  httpProxy: string;
  noProxy: string;
}

export interface StorageClass {
  id: string;
  name: string;
  policy: string;
  volumeBindingMode: 'Immediate' | 'WaitForFirstConsumer';
  reclaimPolicy: 'Delete' | 'Retain';
}

export interface StorageState {
  defaultStorageClass: string;
  spbmPolicy: string;
  vsanDirect: boolean;
  extraStorageClasses: StorageClass[];
}

export interface ClusterVariable {
  id: string;
  name: string;
  type: 'string' | 'integer' | 'boolean' | 'object';
  defaultValue: string;
  required: boolean;
}

export interface ClusterClassState {
  meta: MetaState;
  infra: InfraState;
  controlPlane: ControlPlaneState;
  workerPools: WorkerPool[];
  network: NetworkState;
  storage: StorageState;
  variables: ClusterVariable[];
}
