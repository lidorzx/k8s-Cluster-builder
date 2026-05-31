import type { ClusterFormState } from '../types/cluster';

export interface ValidationItem {
  field: string;
  message: string;
}

export interface ValidationResult {
  errors: ValidationItem[];   // block a working manifest
  warnings: ValidationItem[]; // worth double-checking, non-blocking
}

// Kubernetes DNS-1123 label: lowercase alphanumeric or '-', start/end alphanumeric, ≤63 chars.
const DNS1123 = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
function isDns1123(s: string): boolean {
  return s.length <= 63 && DNS1123.test(s);
}

function isValidCidr(cidr: string): boolean {
  const parts = cidr.split('/');
  if (parts.length !== 2) return false;
  const prefix = parseInt(parts[1], 10);
  if (Number.isNaN(prefix) || prefix < 0 || prefix > 32) return false;
  const octets = parts[0].split('.');
  if (octets.length !== 4) return false;
  return octets.every((o) => {
    const n = parseInt(o, 10);
    return /^\d+$/.test(o) && n >= 0 && n <= 255;
  });
}

export function validateState(state: ClusterFormState): ValidationResult {
  const errors: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];

  // ── Identity ──
  if (!state.name.trim()) {
    errors.push({ field: 'Cluster Name', message: 'Required' });
  } else if (!isDns1123(state.name.trim())) {
    errors.push({ field: 'Cluster Name', message: 'Lowercase letters, digits and hyphens only (max 63)' });
  } else if (state.name.trim().length > 40) {
    warnings.push({ field: 'Cluster Name', message: 'Long names risk exceeding 63 chars once node suffixes are appended' });
  }

  if (!state.namespace.trim()) {
    errors.push({ field: 'Namespace', message: 'Required' });
  } else if (!isDns1123(state.namespace.trim())) {
    errors.push({ field: 'Namespace', message: 'Must be a valid namespace name (lowercase, digits, hyphens)' });
  }

  // ── Release / compute ──
  if (!state.kubernetesVersion.trim()) {
    errors.push({ field: 'Kubernetes Release', message: 'Required' });
  } else if (!/^v\d+\.\d+\.\d+/.test(state.kubernetesVersion.trim())) {
    warnings.push({ field: 'Kubernetes Release', message: 'Expected a TKR string like v1.33.6---vmware.1-fips-vkr.2 — verify with `kubectl get tkr`' });
  }

  if (!state.vmClass.trim()) errors.push({ field: 'VM Class', message: 'Required' });
  if (!state.storageClass.trim()) errors.push({ field: 'Storage Class', message: 'Required' });

  if (state.controlPlane.replicas === 1) {
    warnings.push({ field: 'Control Plane', message: '1 replica has no high availability — use 3 or 5 for production' });
  }
  if (!state.controlPlane.contentLibrary.trim()) {
    warnings.push({ field: 'Content Library', message: 'Empty — the OS image may not resolve unless a default content library is configured' });
  }

  // ── Worker pools ──
  state.workerPools.forEach((pool, i) => {
    const label = pool.name.trim() || `Node Pool #${i + 1}`;
    if (pool.name.trim() && !isDns1123(pool.name.trim())) {
      errors.push({ field: label, message: 'Pool name must be lowercase letters, digits and hyphens' });
    }
    if (pool.replicas < 0 || Number.isNaN(pool.replicas)) {
      errors.push({ field: label, message: 'Replicas must be 0 or more' });
    }
  });

  // ── Custom-mode networking ──
  if (state.configType === 'custom') {
    const podCidr = state.podCidr.trim();
    const svcCidr = state.serviceCidr.trim();
    if (!podCidr) errors.push({ field: 'Pods CIDR', message: 'Required' });
    else if (!isValidCidr(podCidr)) errors.push({ field: 'Pods CIDR', message: 'Must be a valid CIDR (e.g. 192.168.0.0/16)' });
    if (!svcCidr) errors.push({ field: 'Services CIDR', message: 'Required' });
    else if (!isValidCidr(svcCidr)) errors.push({ field: 'Services CIDR', message: 'Must be a valid CIDR (e.g. 10.96.0.0/12)' });

    // ── Registry trust ──
    state.registryTrust.forEach((r, i) => {
      const label = r.registryHost.trim() || `Registry #${i + 1}`;
      if (r.mode === 'paste') {
        if (!r.caKey.trim()) errors.push({ field: label, message: 'CA data key is required' });
        else if (!isDns1123(r.caKey.trim())) errors.push({ field: label, message: 'CA data key must be a valid Secret key (lowercase, digits, hyphens)' });
        if (!r.certPem.trim()) errors.push({ field: label, message: 'Paste the CA certificate (PEM)' });
        else if (!r.certPem.includes('BEGIN CERTIFICATE')) errors.push({ field: label, message: 'Certificate must be PEM (-----BEGIN CERTIFICATE-----)' });
      } else {
        if (!r.secretName.trim()) errors.push({ field: label, message: 'Secret name is required' });
        if (!r.secretKey.trim()) errors.push({ field: label, message: 'Secret data key is required' });
      }
    });

    // ── Registry authentication (pull secret) ──
    const a = state.registryAuth;
    if (a.enabled) {
      if (!a.secretName.trim()) errors.push({ field: 'Pull Secret Name', message: 'Required' });
      else if (!isDns1123(a.secretName.trim())) errors.push({ field: 'Pull Secret Name', message: 'Must be a valid Secret name' });
      if (!a.namespace.trim()) errors.push({ field: 'Workload Namespace', message: 'Required' });
      else if (!isDns1123(a.namespace.trim())) errors.push({ field: 'Workload Namespace', message: 'Must be a valid namespace name' });
      if (!a.registryServer.trim()) errors.push({ field: 'Registry Server', message: 'Required' });
      if (!a.username.trim()) errors.push({ field: 'Registry Username', message: 'Required' });
      if (!a.password.trim()) errors.push({ field: 'Registry Password / Token', message: 'Required' });
      if (a.email.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.email.trim())) {
        warnings.push({ field: 'Registry Email', message: 'Does not look like a valid email address' });
      }
    }
  }

  return { errors, warnings };
}
