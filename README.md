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

> Issued by a sub-CA? Insert the **full chain** — the root CA **and** every sub-CA/intermediate
> (never the registry's leaf cert). If they come bundled in one PEM, don't trust it as one blob —
> split it and add one entry per certificate. See *Trusting a CA bundle* in the deployment guide.

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
  artifactory-ca: <double base64-encoded PEM>
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
                    key: artifactory-ca
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

Optionally generates a `docker-registry` (`dockerconfigjson`) pull secret — the credentials half.
This is equivalent to what `kubectl create secret docker-registry` produces:

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

Using it is day-2 work, after the cluster is running:

1. Apply the secret to a namespace in the **guest cluster** (not the Supervisor).
2. Make workloads use it — either add `imagePullSecrets: [{ name: regcred }]` to the
   pod/Deployment, or attach it to the namespace's default service account so every pod inherits it:
   ```bash
   kubectl patch serviceaccount default -n apps \
     -p '{"imagePullSecrets":[{"name":"regcred"}]}'
   ```
3. The **Registry Server** value must match the registry host in your image references **exactly** —
   including the port if you use the port-based access method.

> **Different apply target.** The pull secret is applied to the **guest cluster's** workload
> namespace (day-2), not the Supervisor — so it's a standalone tab, kept out of the Supervisor
> bundle. Credentials are encoded entirely in your browser; nothing is uploaded anywhere.

### 3. Creating the secrets without YAML (`kubectl`)

Don't want a manifest on disk (air-gapped jump host, quick one-off)? Create both secrets
imperatively — same objects, no file.

**First, make sure the CA is PEM.** The builder's paste field and every command below need **PEM**
— text that starts with `-----BEGIN CERTIFICATE-----`. A `.crt` / `.cer` file may be PEM *or* binary
DER, so check before you encode anything:

```bash
# PEM → use the file as-is;  otherwise it's DER and must be converted:
grep -q "BEGIN CERTIFICATE" ca.crt && echo "PEM — use as-is" || echo "DER — convert it"

# DER → PEM (only if the check above said DER):
openssl x509 -inform der -in ca.crt -out ca.pem
```

- **Already PEM** (`ca.crt` shows the `BEGIN CERTIFICATE` header) → use that file directly below.
- **Binary DER** → convert with the `openssl` line above, then use the resulting `ca.pem`.

Encoding a DER file where PEM is expected is a common silent trust failure.

**Trust secret — Supervisor namespace.** Mind the double encoding: `kubectl` base64-encodes the
value you pass it once, so hand it the **inner** base64 of the PEM and the stored value ends up
double-encoded, exactly as VKS expects.

```bash
# Single CA:
kubectl create secret generic registry-ca-trust-secret -n namespace-myorg-xxxx \
  --from-literal=artifactory-ca="$(base64 -w0 ca.crt)"

# Sub-CA chain — one key per cert, root AND every sub-CA (never the leaf):
kubectl create secret generic registry-ca-trust-secret -n namespace-myorg-xxxx \
  --from-literal=artifactory-ca-root="$(base64 -w0 root-ca.crt)" \
  --from-literal=artifactory-ca-sub="$(base64 -w0 sub-ca.crt)"
```

> Don't use `--from-file=artifactory-ca=ca.crt` with the raw PEM — that encodes it only **once**
> and the node trust import fails. The `--from-literal="$(base64 -w0 …)"` form is what produces the
> double encoding.

The cluster still has to **reference** those keys under `osConfiguration.trust.additionalTrustedCAs`
— generate that part with the builder, or `kubectl patch` it into a live cluster (see the
[deployment guide](https://github.com/lidorzx/vks-registry/blob/main/docs/vks9-artifactory-connection-guide.md), A.4).

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
