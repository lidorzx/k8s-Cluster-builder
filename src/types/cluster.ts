export interface Volume {
  id: string;
  name: string;          // vol-XXXX auto-generated
  mountPath: string;
  storageClass: string;
  capacity: string;      // e.g. "20Gi"
}

export interface WorkerPool {
  id: string;
  name: string;           // auto or custom: clusterName-np-XXXX / clusterName-nodepool-XXXX
  poolClass: string;      // e.g. "node-pool"
  replicas: number;
  osImageName: string;    // e.g. "photon"
  contentLibrary: string; // e.g. "cl-9677891d7c087127c"
  // optional per-pool overrides (added as variables.overrides in YAML when non-empty)
  vmClass?: string;
  storageClass?: string;
  volumes?: Volume[];
}

export interface ClusterFormState {
  configType: 'default' | 'custom';
  name: string;
  namespace: string;
  clusterClassName: string;
  classNamespace: string;
  kubernetesVersion: string;
  podCidr: string;
  serviceCidr: string;
  serviceDomain: string;
  defaultStorageClass: string;
  endpointFQDNs: string[];
  certificateRotationEnabled: boolean;
  certificateRotationDays: number;
  ntpServers: string[];
  vmClass: string;
  storageClass: string;
  volumes: Volume[];
  controlPlane: {
    replicas: 1 | 3 | 5;
    osImageName: string;
    contentLibrary: string;
    volumeOverrides: Volume[];
  };
  workerPools: WorkerPool[];
}
