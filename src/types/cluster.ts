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

// A private container registry whose CA certificate the cluster nodes must trust.
// Emitted as an entry under osConfiguration.trust.additionalTrustedCAs in the Cluster
// spec. In "paste" mode the builder also generates the companion Supervisor Secret
// that holds the (double base64-encoded) PEM.
export interface RegistryTrust {
  id: string;
  registryHost: string;   // UX label only, e.g. "artifactory.company.com" — not emitted in trust YAML
  mode: 'paste' | 'existing';
  // paste mode — user pastes the PEM, builder generates the Secret + reference
  certPem: string;        // raw PEM text (-----BEGIN CERTIFICATE-----…)
  caKey: string;          // data key under which the CA is stored, e.g. "artifactory-ca"
  // existing mode — reference a Secret already present in the Supervisor namespace
  secretName: string;     // existing secret name
  secretKey: string;      // key within that secret
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
  registryTrust: RegistryTrust[];
  registryTrustSecretName: string;   // name of the Secret the builder generates for pasted CAs
  controlPlane: {
    replicas: 1 | 3 | 5;
    osImageName: string;
    contentLibrary: string;
    volumeOverrides: Volume[];
  };
  workerPools: WorkerPool[];
}
