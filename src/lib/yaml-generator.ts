import yaml from 'js-yaml';
import type { ClusterFormState, Volume } from '../types/cluster';

const DUMP_OPTS = { noRefs: true, lineWidth: -1 };

function genNpSuffix(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// Stable suffix per pool id so YAML doesn't change on re-render
const poolSuffixCache = new Map<string, string>();
function getPoolSuffix(id: string): string {
  if (!poolSuffixCache.has(id)) poolSuffixCache.set(id, genNpSuffix());
  return poolSuffixCache.get(id)!;
}

function volumeObj(v: Volume) {
  return {
    name: v.name,
    mountPath: v.mountPath,
    storageClass: v.storageClass,
    capacity: v.capacity,
  };
}

export function generateYaml(state: ClusterFormState): string {
  const {
    name,
    namespace,
    clusterClassName,
    classNamespace,
    kubernetesVersion,
    podCidr,
    serviceCidr,
    serviceDomain,
    defaultStorageClass,
    endpointFQDNs,
    certificateRotationEnabled,
    certificateRotationDays,
    ntpServers,
    vmClass,
    storageClass,
    volumes,
    controlPlane,
    workerPools,
  } = state;

  // Build topology variables
  const variables: Array<{ name: string; value: unknown }> = [];

  // vsphereOptions — only if defaultStorageClass is non-empty
  if (defaultStorageClass) {
    variables.push({
      name: 'vsphereOptions',
      value: {
        persistentVolumes: {
          defaultStorageClass,
        },
      },
    });
  }

  // kubernetes — only include when FQDNs are set OR certificate rotation is explicitly enabled
  const validFqdns = endpointFQDNs.filter((f) => f.trim() !== '');
  if (validFqdns.length > 0 || certificateRotationEnabled) {
    const kubeValue: Record<string, unknown> = {};
    if (validFqdns.length > 0) {
      kubeValue.endpointFQDNs = validFqdns;
    }
    if (certificateRotationEnabled) {
      kubeValue.certificateRotation = {
        enabled: true,
        renewalDaysBeforeExpiry: certificateRotationDays,
      };
    }
    variables.push({ name: 'kubernetes', value: kubeValue });
  }

  // osConfiguration — only if ntpServers has a non-empty entry
  const validNtp = ntpServers.filter((s) => s.trim() !== '');
  if (validNtp.length > 0) {
    variables.push({
      name: 'osConfiguration',
      value: {
        ntp: {
          servers: validNtp,
        },
      },
    });
  }

  // vmClass
  if (vmClass) {
    variables.push({ name: 'vmClass', value: vmClass });
  }

  // storageClass
  if (storageClass) {
    variables.push({ name: 'storageClass', value: storageClass });
  }

  // volumes
  if (volumes.length > 0) {
    variables.push({ name: 'volumes', value: volumes.map(volumeObj) });
  }

  // controlPlane annotation
  const cpAnnotation =
    controlPlane.osImageName || controlPlane.contentLibrary
      ? `os-name=${controlPlane.osImageName}${controlPlane.contentLibrary ? `, content-library=${controlPlane.contentLibrary}` : ''}`
      : undefined;

  const cpObj: Record<string, unknown> = {
    replicas: controlPlane.replicas,
    metadata: {
      annotations: cpAnnotation
        ? { 'run.tanzu.vmware.com/resolve-os-image': cpAnnotation }
        : {},
    },
  };

  // controlPlane variables overrides
  if (controlPlane.volumeOverrides.length > 0) {
    cpObj.variables = {
      overrides: [
        {
          name: 'volumes',
          value: controlPlane.volumeOverrides.map(volumeObj),
        },
      ],
    };
  }

  // worker pools
  const machineDeployments = workerPools.map((pool) => {
    const poolName = pool.name || `${name}-np-${getPoolSuffix(pool.id)}`;
    const workerAnnotation =
      pool.osImageName || pool.contentLibrary
        ? `os-name=${pool.osImageName}${pool.contentLibrary ? `, content-library=${pool.contentLibrary}` : ''}`
        : undefined;

    const mdObj: Record<string, unknown> = {
      class: pool.poolClass,
      name: poolName,
      replicas: pool.replicas,
      metadata: {
        annotations: workerAnnotation
          ? { 'run.tanzu.vmware.com/resolve-os-image': workerAnnotation }
          : {},
      },
    };

    const overrides: Array<{ name: string; value: unknown }> = [];
    if (pool.vmClass) overrides.push({ name: 'vmClass', value: pool.vmClass });
    if (pool.storageClass) overrides.push({ name: 'storageClass', value: pool.storageClass });
    if (pool.volumes && pool.volumes.length > 0) {
      overrides.push({ name: 'volumes', value: pool.volumes.map(volumeObj) });
    }
    if (overrides.length > 0) {
      mdObj.variables = { overrides };
    }

    return mdObj;
  });

  const doc = {
    apiVersion: 'cluster.x-k8s.io/v1beta1',
    kind: 'Cluster',
    metadata: {
      name,
      namespace,
    },
    spec: {
      clusterNetwork: {
        pods: { cidrBlocks: [podCidr] },
        services: { cidrBlocks: [serviceCidr] },
        serviceDomain,
      },
      topology: {
        class: clusterClassName,
        classNamespace,
        version: kubernetesVersion,
        variables,
        controlPlane: cpObj,
        workers: {
          machineDeployments,
        },
      },
    },
  };

  return yaml.dump(doc, DUMP_OPTS);
}

export interface YamlDoc {
  id: string;
  label: string;
  name: string;
  yamlText: string;
}

export function generateYamlDocs(state: ClusterFormState): YamlDoc[] {
  const yamlText = generateYaml(state);
  return [
    {
      id: 'cluster',
      label: 'Cluster',
      name: state.name,
      yamlText,
    },
  ];
}
