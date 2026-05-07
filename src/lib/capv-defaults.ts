import type { ClusterFormState } from '../types/cluster';

export const defaultState: ClusterFormState = {
  configType: 'default',
  name: 'kubernetes-cluster',
  namespace: '',
  clusterClassName: 'builtin-generic-v3.4.0',
  classNamespace: 'vmware-system-vks-public',
  kubernetesVersion: 'v1.33.6---vmware.1-fips-vkr.2',
  podCidr: '192.168.156.0/20',
  serviceCidr: '10.96.0.0/12',
  serviceDomain: 'cluster.local',
  defaultStorageClass: '',
  endpointFQDNs: [''],
  certificateRotationEnabled: false,
  certificateRotationDays: 90,
  ntpServers: [''],
  vmClass: 'best-effort-medium',
  storageClass: '',
  volumes: [],
  controlPlane: {
    replicas: 1,
    osImageName: 'photon',
    contentLibrary: '',
    volumeOverrides: [],
  },
  workerPools: [
    {
      id: 'pool-default',
      name: '',
      poolClass: 'node-pool',
      replicas: 1,
      osImageName: 'photon',
      contentLibrary: '',
    },
  ],
};
