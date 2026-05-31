import { LogoMark } from './ui/LogoMark';
import { TuxMascot } from './ui/TuxMascot';

interface LandingPageProps {
  onStart: () => void;
}

const YAML_PREVIEW = `apiVersion: cluster.x-k8s.io/v1beta1
kind: Cluster
metadata:
  name: my-cluster
  namespace: ns-prod-xx4k
spec:
  topology:
    class: builtin-generic-v3.4.0
    version: v1.33.6---vmware.1-fips
    variables:
      - name: vmClass
        value: best-effort-medium
      - name: storageClass
        value: vcf-datastore-policy
    controlPlane:
      replicas: 3
      metadata:
        annotations:
          run.tanzu.vmware.com/resolve-os-image: >-
            os-name=photon,
            content-library=cl-96778...`;

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Exact VCF YAML',
    desc: 'Output matches VCF Automation 9.x field for field — ready to kubectl apply.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: 'Default & Custom',
    desc: 'Quick default config or full control — node pools, volumes, cert rotation and more.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'No backend needed',
    desc: 'Runs entirely in the browser. Nothing is sent anywhere.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Multi node pools',
    desc: 'Add node pools via a guided modal with per-pool VM class, storage and volumes.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Private registry',
    desc: 'Trust a registry CA and generate its pull secret (Artifactory, Harbor) — emitted as separate, ready-to-apply documents.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'Live YAML preview',
    desc: 'See the full manifest update in real time as you type, with syntax highlighting.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Copy or Download',
    desc: 'One-click copy to clipboard or download as a .yaml file.',
  },
];

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink-950">

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-8 py-4">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-7" variant="dark" />
          <span className="text-sm font-semibold text-white/90">VCF Cluster Builder</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-brand-500/30 bg-brand-500/20 px-2.5 py-0.5 text-xs font-medium text-brand-200">Cluster API</span>
          <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/60">VCF 9.x</span>
          <a
            href="https://github.com/lidorzx/k8s-cluster-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-white/40 hover:text-white/80 transition-colors"
            title="View on GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[440px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-1/3 h-[320px] w-[320px] rounded-full bg-sky-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[280px] w-[280px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 max-w-5xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: text + CTA */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
              VMware Cloud Foundation 9.x
            </div>

            <h1 className="mb-4 text-4xl font-bold leading-tight text-white lg:text-5xl">
              Kubernetes Cluster<br />
              <span className="bg-gradient-to-r from-brand-400 via-sky-400 to-sky-300 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                YAML Builder
              </span>
            </h1>

            <p className="text-base text-white/50 mb-8 max-w-md lg:max-w-none leading-relaxed">
              Generate production-ready Cluster API manifests for VCF 9.x.<br />
              Same output as VCF Automation — no backend, no login required.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3">
              <button
                type="button"
                onClick={onStart}
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gradient bg-[length:200%_200%] px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-[position:100%_50%] hover:shadow-glow-sky active:scale-[0.98]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Cluster
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a
                href="https://github.com/lidorzx/k8s-cluster-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Right: YAML preview */}
          <div className="flex-shrink-0 w-full lg:w-[420px]">
            <div className="rounded-lg border border-white/10 overflow-hidden shadow-2xl shadow-black/40">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border-b border-white/10">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-xs text-white/30 font-mono">my-cluster.yaml</span>
              </div>
              {/* Code */}
              <pre className="bg-[#0d1117] text-[0.7rem] leading-relaxed p-4 overflow-x-auto font-mono">
                {YAML_PREVIEW.split('\n').map((line, i) => {
                  const isKey = /^\s*(apiVersion|kind|metadata|spec|name|namespace|topology|class|version|variables|controlPlane|replicas|annotations|workers):/.test(line);
                  const isValue = /^\s+value:/.test(line) || /:\s+\S/.test(line);
                  const isDash = /^\s+-\s/.test(line);
                  return (
                    <div key={i} className={
                      isKey ? 'text-sky-400' :
                      isDash ? 'text-blue-300' :
                      isValue ? 'text-green-300/80' :
                      'text-white/40'
                    }>
                      {line || ' '}
                    </div>
                  );
                })}
                <div className="text-white/20 mt-1 animate-pulse">▋</div>
              </pre>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="relative z-10 max-w-5xl w-full mt-20 grid grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-white/[0.06]"
            >
              <div className="mb-2.5 text-brand-300 transition-colors group-hover:text-sky-300">{icon}</div>
              <div className="mb-1 text-sm font-semibold text-white/85">{title}</div>
              <div className="text-xs leading-relaxed text-white/40">{desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-5 border-t border-white/8 text-xs text-white/25 space-y-1">
        <div>VCF Kubernetes Cluster Builder · Cluster API · VCF 9.x</div>
        <div>
          Built by{' '}
          <a
            href="https://github.com/lidorzx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400/70 hover:text-sky-400 transition-colors"
          >
            Lidor Eliya
          </a>
        </div>
      </footer>

      {/* DevOps Tux — watches your cursor */}
      <div className="pointer-events-none fixed bottom-2 left-6 z-20 hidden xl:block">
        <div className="relative">
          {/* glow aura */}
          <div className="absolute inset-x-4 bottom-8 top-16 rounded-[40%] bg-brand-500/25 blur-3xl animate-pulse-slow" />

          {/* floating terminal */}
          <div className="absolute -top-3 left-1/2 w-max max-w-[15rem] -translate-x-[35%] overflow-hidden rounded-xl border border-white/10 bg-ink-900/90 shadow-lift backdrop-blur-xl">
            <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-400/80" />
              <span className="h-2 w-2 rounded-full bg-amber-400/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              <span className="ml-1 font-mono text-[0.6rem] text-white/40">tux@vcf:~</span>
            </div>
            <div className="px-3 py-2 font-mono text-[0.72rem] leading-none text-emerald-300">
              $ kubectl apply -f cluster.yaml
              <span className="ml-0.5 inline-block animate-caret">▌</span>
            </div>
          </div>

          <TuxMascot className="relative h-56 w-auto animate-float drop-shadow-[0_22px_45px_rgba(0,0,0,0.6)] 2xl:h-64" />
        </div>
      </div>
    </div>
  );
}
