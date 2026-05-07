import type { ClusterFormState } from '../types/cluster';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateState(state: ClusterFormState): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!state.name.trim()) errors.push({ field: 'Cluster Name', message: 'Required' });
  if (!state.namespace.trim()) errors.push({ field: 'Namespace', message: 'Required' });
  if (!state.kubernetesVersion.trim()) errors.push({ field: 'Kubernetes Release', message: 'Required' });
  if (!state.vmClass.trim()) errors.push({ field: 'VM Class', message: 'Required' });
  if (!state.storageClass.trim()) errors.push({ field: 'Storage Class', message: 'Required' });

  if (state.configType === 'custom') {
    if (!state.podCidr.trim()) errors.push({ field: 'Pods CIDR', message: 'Required' });
    if (!state.serviceCidr.trim()) errors.push({ field: 'Services CIDR', message: 'Required' });
    const podCidr = state.podCidr.trim();
    const svcCidr = state.serviceCidr.trim();
    const cidrRe = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    if (podCidr && !cidrRe.test(podCidr)) errors.push({ field: 'Pods CIDR', message: 'Must be a valid CIDR (e.g. 192.168.0.0/16)' });
    if (svcCidr && !cidrRe.test(svcCidr)) errors.push({ field: 'Services CIDR', message: 'Must be a valid CIDR (e.g. 10.96.0.0/12)' });
  }

  return errors;
}
