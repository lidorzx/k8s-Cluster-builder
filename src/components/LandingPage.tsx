import { lazy, Suspense } from 'react';
import { LogoMark } from './ui/LogoMark';
import { TuxMascot } from './ui/TuxMascot';

// 3D Tux is heavy (three.js) — load it lazily and fall back to the SVG.
const Tux3D = lazy(() => import('./ui/Tux3D'));

interface LandingPageProps {
  onStart: () => void;
}

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
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-white">

      {/* Nav — floats over the hero */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-7" variant="dark" />
          <span className="text-sm font-semibold text-white/90">VCF Cluster Builder</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-brand-500/30 bg-brand-500/20 px-2.5 py-0.5 text-xs font-medium text-brand-200">Cluster API</span>
          <span className="hidden rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/60 sm:inline">VCF 9.x</span>
          <a
            href="https://github.com/lidorzx/k8s-cluster-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-white/40 transition-colors hover:text-white/80"
            title="View on GitHub"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </header>

      {/* HERO — cinematic, full height */}
      <section className="relative h-screen min-h-[620px] overflow-hidden">
        {/* Lighting */}
        <div className="pointer-events-none absolute inset-0">
          {/* spotlight beam from the top onto Tux */}
          <div className="absolute -top-40 right-[22%] h-[130vh] w-[480px] -rotate-12 bg-gradient-to-b from-white/12 via-white/5 to-transparent blur-2xl" />
          {/* brand glow behind Tux */}
          <div className="absolute right-[4%] top-[6%] h-[72vh] w-[48vw] rounded-full bg-brand-600/25 blur-3xl" />
          <div className="absolute bottom-0 right-[12%] h-48 w-[44vw] rounded-[50%] bg-sky-500/20 blur-3xl" />
          {/* faint grid + vignette */}
          <div className="absolute inset-0 bg-grid-light opacity-[0.04] [background-size:34px_34px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,transparent_35%,rgba(0,0,0,0.55))]" />
        </div>

        {/* The star: a real-time 3D Tux that watches your cursor */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-[55vw] lg:block">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <TuxMascot className="h-[64vh] w-auto opacity-90" />
              </div>
            }
          >
            <Tux3D className="h-full w-full" />
          </Suspense>
        </div>

        {/* Headline */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 sm:px-10">
          <div className="max-w-xl text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
              VMware Cloud Foundation 9.x
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl xl:text-7xl">
              Kubernetes Cluster
              <span className="mt-1 block animate-gradient-x bg-gradient-to-r from-brand-400 via-sky-400 to-sky-300 bg-[length:200%_auto] bg-clip-text text-transparent">
                YAML Builder
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/55 lg:mx-0 lg:text-lg">
              Generate production-ready Cluster API manifests for VCF 9.x — the same output as
              VCF Automation. No backend, no login. Tux has your back.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <button
                type="button"
                onClick={onStart}
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gradient bg-[length:200%_200%] px-7 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-[position:100%_50%] hover:shadow-glow-sky active:scale-[0.98]"
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
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Tux on small screens (centered, smaller) */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-[1] -translate-x-1/2 opacity-30 lg:hidden">
          <TuxMascot className="h-[40vh] w-auto" />
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/30">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 border-t border-white/5 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Everything you need to ship a cluster</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/45">
              From a one-click default to full custom — with the YAML done right and ready to apply.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:border-brand-400/40 hover:bg-white/[0.06] hover:shadow-glow"
              >
                <div className="mb-3 inline-flex rounded-xl bg-brand-500/10 p-2.5 text-brand-300 transition-colors group-hover:text-sky-300">
                  {icon}
                </div>
                <div className="mb-1 text-sm font-semibold text-white/85">{title}</div>
                <div className="text-xs leading-relaxed text-white/40">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 space-y-1 border-t border-white/5 py-6 text-center text-xs text-white/25">
        <div>VCF Kubernetes Cluster Builder · Cluster API · VCF 9.x</div>
        <div>
          Built by{' '}
          <a
            href="https://github.com/lidorzx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400/70 transition-colors hover:text-brand-400"
          >
            Lidor Eliya
          </a>
        </div>
      </footer>
    </div>
  );
}
