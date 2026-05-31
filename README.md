# VCF Kubernetes Cluster Builder

> Generate production-ready Cluster API manifests for VMware Cloud Foundation 9.x — directly in the browser.

**Live demo:** https://lidorzx.github.io/k8s-Cluster-builder/

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
- **Private registry trust** — Add a private registry's CA certificate so nodes trust it; the builder emits the trust `Secret` and wires the `Cluster` reference for you
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

## Private registry trust

In **Custom** mode, the *Private Registry Trust* step lets you make the cluster nodes trust a
private container registry (JFrog Artifactory, Harbor, etc.) so image pulls don't fail with
`x509: certificate signed by unknown authority`.

Two sources are supported per registry:

- **Paste certificate** — paste the registry's CA in PEM. The builder base64-encodes it (the
  double-encoding VKS expects) and adds a `Secret` document above the `Cluster`, then references
  it from the cluster spec.
- **Use existing secret** — reference a `Secret` you already created in the Supervisor namespace
  by name + key.

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

> **Trust ≠ authentication.** This configures TLS trust only. If your registry needs credentials
> to pull, create a `docker-registry` pull secret inside the guest cluster as a separate day-2
> step — the builder intentionally does not embed registry credentials in the manifest.

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
