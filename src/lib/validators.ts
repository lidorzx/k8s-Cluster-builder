import type { ClusterFormState } from '../types/cluster';

function isValidCidr(cidr: string): boolean {
  if (!cidr) return false;
  const parts = cidr.split('/');
  if (parts.length !== 2) return false;
  const prefix = parseInt(parts[1], 10);
  if (isNaN(prefix) || prefix < 0 || prefix > 32) return false;
  const ipParts = parts[0].split('.');
  if (ipParts.length !== 4) return false;
  return ipParts.every((p) => {
    const n = parseInt(p, 10);
    return !isNaN(n) && n >= 0 && n <= 255;
  });
}

export function validateState(state: ClusterFormState): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!state.name) {
    errors['name'] = 'Name is required';
  } else if (!/^[a-z0-9][a-z0-9-]*$/.test(state.name)) {
    errors['name'] = 'Name must be lowercase alphanumeric with hyphens only';
  }

  if (!state.namespace) {
    errors['namespace'] = 'Namespace is required';
  }

  if (!state.kubernetesVersion) {
    errors['kubernetesVersion'] = 'Kubernetes version is required';
  }

  if (state.podCidr && !isValidCidr(state.podCidr)) {
    errors['podCidr'] = 'Invalid CIDR (e.g. 192.168.0.0/16)';
  }

  if (state.serviceCidr && !isValidCidr(state.serviceCidr)) {
    errors['serviceCidr'] = 'Invalid CIDR (e.g. 10.96.0.0/12)';
  }

  state.workerPools.forEach((pool, i) => {
    if (pool.name && !/^[a-z0-9][a-z0-9-]*$/.test(pool.name)) {
      errors[`workerPools[${i}].name`] = 'Pool name must be lowercase alphanumeric with hyphens';
    }
  });

  return errors;
}

export function sectionHasErrors(errors: Record<string, string>, section: string): boolean {
  return Object.keys(errors).some((key) => key.startsWith(section));
}
