# VCF Kubernetes Cluster Builder

> Generate production-ready Cluster API manifests for VMware Cloud Foundation 9.x — directly in the browser.

**Live demo:** https://lidorzx.github.io/k8s-Cluster-builder/

**Companion deployment guide:** [vks-artifactory-runbook](https://github.com/lidorzx/vks-registry/blob/main/docs/vks9-artifactory-connection-guide.md) — step-by-step guide to apply the YAML this tool generates and connect a private registry (CA trust + pull secret) on VCF 9 / VKS, with or without VCF Automation.

---

## What is this?

A fully client-side web tool that lets you configure and export a `kind: Cluster` YAML manifest compatible with VCF Automation 9.x and Cluster API (CAPI). No backend, no login, no installation needed.

The output is byte-for-byte identical to what VCF Automation generates when you go through the "New Kubernetes Cluster" wizard.

---

## Features

- **Default & Custom config** — Quick minimal setup or full control over every field
- **Live YAML preview** — Manifest updates in real time as you type, with syntax highlighting
- **Node pool management** — Add multiple pools via a guided modal with per-pool overrides
- **Volumes support** — Configure persistent volumes at cluster, control plane, or per-pool level
- **Private registry** — Trust a registry's CA certificate **and** generate its pull secret; emitted as separate, ready-to-apply documents with per-document tabs (copy/download each on its own)
- **Content Library ID helper** — Built-in `kubectl` command hint to find your content library ID
- **Copy or Download** — One-click copy to clipboard or download as `.yaml`
- **No dependencies** — Runs entirely in the browser

---

## YAML output example

```yaml
apiVersion: cluster.x-k8s.io/v1beta1
kind: Cluster
metadata:
  name: my-cluster
  namespace: namespace-myorg-xxxx
spec:
  clusterNetwork:
    pods:
      cidrBlocks:
        - 192.168.156.0/20
    services:
      cidrBlocks:
        - 10.96.0.0/12
    serviceDomain: cluster.local
  topology:
    class: builtin-generic-v3.4.0
    classNamespace: vmware-system-vks-public
    version: v1.33.6---vmware.1-fips-vkr.2
    variables:
      - name: vmClass
        value: best-effort-medium
      - name: storageClass
        value: vcf-datastore-policy
    controlPlane:
      replicas: 1
      metadata:
        annotations:
          run.tanzu.vmware.com/resolve-os-image: os-name=photon, content-library=cl-xxxx
    workers:
      machineDeployments:
        - class: node-pool
          name: my-cluster-np-ab12
          replicas: 1
          metadata:
            annotations:
              run.tanzu.vmware.com/resolve-os-image: os-name=photon, content-library=cl-xxxx
```

---

## Private registry

In **Custom** mode, the *Private Registry* step covers the **two independent halves** of connecting
a cluster to a private container registry (JFrog Artifactory, Harbor, etc.). The registry is fronted
by an **internal, offline CA** (not a public one), so you need **both** halves — they fail
differently and one does not imply the other:

- **Trust (TLS)** — missing → `x509: certificate signed by unknown authority`
- **Authentication (pull secret)** — missing → `401 Unauthorized` / `ImagePullBackOff`

Each generated resource appears as its own tab in the YAML panel with independent copy/download.
For the full apply-and-verify procedure, see the
[deployment guide](https://github.com/lidorzx/vks-registry/blob/main/docs/vks9-artifactory-connection-guide.md).

### 1. Trust — CA certificate

Makes the cluster nodes trust the registry's TLS certificate, so image pulls don't fail with
`x509: certificate signed by unknown authority`. The cert is signed by an internal/offline CA the
nodes don't ship with, so this step is **always required** — there's no public-CA shortcut here.

Two sources are supported per registry:

- **Paste certificate** — paste the issuing CA in PEM. The builder applies the double-base64
  encoding VKS expects and adds a `Secret` document **above** the `Cluster` (it must exist before
  the cluster references it), then wires the `secretRef` into the cluster spec.
- **Use existing secret** — reference a `Secret` you already created in the Supervisor namespace
  by name + key.

> Issued by a sub-CA? Provide the **full chain in one PEM**, ordered **leaf → root**: the Artifactory
> cert, then the intermediate (sub-CA), then the root CA. Paste that as a single entry; see
> [§3](#3-creating-the-secrets-without-yaml-kubectl) for converting, ordering and combining certs.

The trust is emitted under the cluster's `osConfiguration` variable (merged with NTP if set):

```yaml
# ── Secret (generated for pasted certs) ──
apiVersion: v1
kind: Secret
metadata:
  name: registry-ca-trust-secret
  namespace: namespace-myorg-xxxx
type: Opaque
data:
  additional-ca-1: <double base64-encoded PEM>
---
# ── Cluster (reference) ──
spec:
  topology:
    variables:
      - name: osConfiguration
        value:
          trust:
            additionalTrustedCAs:
              - caCert:
                  secretRef:
                    name: registry-ca-trust-secret
                    key: additional-ca-1
```

The Trust Secret and the Cluster both target the **Supervisor** namespace, so they share an
**All (Supervisor)** tab that joins them into one apply bundle — apply the secret first (the tab
already orders it that way).

> **Trust is baked into nodes at provision/rollout, not applied live.** On a new cluster it takes
> effect as nodes come up. Adding or changing trust on a *running* cluster triggers a **rolling
> node update**, and the secret is immutable once referenced — rotate by creating a new secret and
> repointing the spec; editing the secret's data in place does nothing. In air-gapped sites you can
> also patch trust into an already-provisioned cluster (see the deployment guide, A.4).

### 2. Authentication — pull secret

The credentials half. Easiest path is the **command** — run it in a namespace inside the **guest
cluster** (not the Supervisor), after the cluster is running:

```bash
kubectl create secret docker-registry regcred \
  --docker-server=artifactory.company.com \
  --docker-username='your-username' \
  --docker-password='your-access-token' \
  -n apps

# Make every pod in the namespace use it automatically:
kubectl patch serviceaccount default -n apps \
  -p '{"imagePullSecrets":[{"name":"regcred"}]}'
```

- `--docker-server` must match the registry host in your image references **exactly** (with the port
  if you use the port-based method).
- Per-workload instead of the SA patch: add `imagePullSecrets: [{ name: regcred }]` to the Pod/Deployment.

Prefer YAML? The builder emits the equivalent `dockerconfigjson` Secret — same object, applied to the
guest namespace:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: regcred
  namespace: apps            # workload namespace in the GUEST cluster
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <base64 { auths: { <server>: { username, password, auth, email } } }>
```

> Credentials are encoded entirely in your browser; nothing is uploaded anywhere.

### 3. Creating the secrets without YAML (`kubectl`)

Don't want a manifest on disk (air-gapped jump host, quick one-off)? Create both secrets
imperatively — same objects, no file.

**First, build one PEM file with the full chain — in order.** Everything below works on **PEM**
(text, `-----BEGIN CERTIFICATE-----`). The bundle must hold the **whole chain, ordered leaf → root**:

1. the **Artifactory server cert**, then
2. the **intermediate (sub-CA)**, then
3. the **root CA** last.

Order matters — keep it Artifactory → intermediate → root.

```bash
# Every file must be PEM. This lists any that are binary DER (convert those):
grep -L "BEGIN CERTIFICATE" *.crt
#   convert a DER file:  openssl x509 -inform der -in <file>.crt -out <file>.pem

# Concatenate in chain order — Artifactory (leaf) → intermediate (sub-CA) → root CA:
cat artifactory.crt sub-ca.crt root-ca.crt > ca-chain.pem

# Confirm the bundle holds every cert, in order (read subject/issuer top to bottom):
openssl crl2pkcs7 -nocrl -certfile ca-chain.pem | openssl pkcs7 -print_certs -noout
```

If Artifactory's cert is **self-signed** (no separate CA), it's the whole chain on its own — use it
as your `ca-chain.pem`. Getting the order wrong, or feeding DER where PEM is expected, is a common
silent trust failure.

**Trust secret — Supervisor namespace.** The whole PEM bundle goes into **one key** — VKS reads the
full chain from it. Mind the double encoding: `kubectl` base64-encodes the value you pass it once, so
hand it the **inner** base64 of the bundle and the stored value ends up double-encoded (base64 of
base64), exactly as VKS expects.

```bash
# Create the secret from the one-PEM bundle (inner base64; kubectl adds the outer):
kubectl create secret generic registry-ca-trust-secret -n namespace-myorg-xxxx \
  --from-literal=additional-ca-1="$(base64 -w0 ca-chain.pem)"

# Verify it round-trips — double-decode the stored value; you should see every cert in the chain:
kubectl get secret registry-ca-trust-secret -n namespace-myorg-xxxx \
  -o jsonpath='{.data.additional-ca-1}' | base64 -d | base64 -d \
  | openssl crl2pkcs7 -nocrl -certfile /dev/stdin | openssl pkcs7 -print_certs -noout
```

> Use `--from-literal="$(base64 -w0 …)"`, **not** `--from-file=…=ca.pem` — `--from-file` encodes the
> bundle only **once** and the node trust import fails. The whole bundle lives under one key; VKS
> reads every cert in it. (If a cert ever isn't picked up, fall back to one key per cert.)

**Add the trust to an already-running cluster.** The common day-2 case: the cluster is deployed and
you now need it to trust the registry. The secret exists (above) — point the live cluster at it.

You're editing **the `Cluster` object you generated** (e.g. `my-cluster`), via the **Supervisor
context** where that object lives. This changes *your* cluster only — not the Supervisor — and trust
is per-cluster. Make sure the name and namespace below are your generated cluster's, and **back up
its current spec first** so you can roll back:

```bash
# Supervisor context. Back up the generated cluster's YAML before you touch it:
kubectl get cluster my-cluster -n namespace-myorg-xxxx -o yaml > my-cluster.backup.yaml

# (roll back later if needed:  kubectl apply -f my-cluster.backup.yaml)
```

`spec.topology.variables` is a list, so use a **JSON patch** (`--type=json`); a merge patch would
replace the whole list and drop your other variables.

```bash
# Most clusters have no osConfiguration yet → append one:
kubectl patch cluster my-cluster -n namespace-myorg-xxxx --type=json -p='[
  {
    "op": "add",
    "path": "/spec/topology/variables/-",
    "value": {
      "name": "osConfiguration",
      "value": {
        "trust": {
          "additionalTrustedCAs": [
            { "caCert": { "secretRef": { "key": "additional-ca-1", "name": "registry-ca-trust-secret" } } }
          ]
        }
      }
    }
  }
]'
```

If `osConfiguration` already exists (e.g. it carries `ntp`), don't append a second one — add `trust`
under its existing index:

```bash
# Find the index (0-based):
kubectl get cluster my-cluster -n namespace-myorg-xxxx \
  -o jsonpath='{range .spec.topology.variables[*]}{.name}{"\n"}{end}'

# …then, if osConfiguration is index 2:
kubectl patch cluster my-cluster -n namespace-myorg-xxxx --type=json -p='[
  {
    "op": "add",
    "path": "/spec/topology/variables/2/value/trust",
    "value": {
      "additionalTrustedCAs": [
        { "caCert": { "secretRef": { "key": "additional-ca-1", "name": "registry-ca-trust-secret" } } }
      ]
    }
  }
]'
```

The patch triggers a **rolling node update** — trust is baked into each node as it re-rolls. Confirm
it landed, then watch the roll:

```bash
kubectl get cluster my-cluster -n namespace-myorg-xxxx \
  -o jsonpath='{.spec.topology.variables[?(@.name=="osConfiguration")].value.trust}'
kubectl get machines -n namespace-myorg-xxxx -w
```

> Provisioning a **new** cluster instead? Generate the same `osConfiguration.trust` block with the
> builder, or see the
> [deployment guide](https://github.com/lidorzx/vks-registry/blob/main/docs/vks9-artifactory-connection-guide.md)
> (A.3 new cluster, A.4 existing, plus the LCI UI path).

**Pull secret — guest cluster namespace.** Imperative by nature:

```bash
kubectl create secret docker-registry regcred \
  --docker-server=artifactory.company.com \
  --docker-username='your-username' \
  --docker-password='your-access-token' \
  -n apps

# Make every pod in the namespace use it automatically:
kubectl patch serviceaccount default -n apps \
  -p '{"imagePullSecrets":[{"name":"regcred"}]}'
```

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| YAML generation | js-yaml |
| Syntax highlight | react-syntax-highlighter |

---

## Running locally

```bash
git clone https://github.com/lidorzx/k8s-cluster-builder.git
cd k8s-cluster-builder
npm install
npm run dev
```

App runs at `http://localhost:5173`.

---

## Deployment

GitHub Actions builds the app on every push to `main` and publishes the generated `dist` folder to the `gh-pages` branch.

In GitHub Pages settings, set the source to:

- Branch: `gh-pages`
- Folder: `/ (root)`

---

## Author

Lidor Eliya
