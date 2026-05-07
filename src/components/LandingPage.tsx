interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex flex-col">

      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <svg className="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l8.66 5v10L12 22 3.34 17V7L12 2z" />
            <circle cx="12" cy="12" r="2.5" strokeWidth={1.5} />
            <line x1="12" y1="9.5" x2="12" y2="7" strokeWidth={1.5} />
            <line x1="12" y1="14.5" x2="12" y2="17" strokeWidth={1.5} />
            <line x1="9.83" y1="10.75" x2="7.5" y2="9.4" strokeWidth={1.5} />
            <line x1="14.17" y1="13.25" x2="16.5" y2="14.6" strokeWidth={1.5} />
            <line x1="9.83" y1="13.25" x2="7.5" y2="14.6" strokeWidth={1.5} />
            <line x1="14.17" y1="10.75" x2="16.5" y2="9.4" strokeWidth={1.5} />
          </svg>
          <span className="text-sm font-semibold text-gray-700">VCF Kubernetes Cluster Builder</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">Cluster API</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">VCF 9.x</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-16">
        <div className="max-w-2xl w-full text-center">

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l8.66 5v10L12 22 3.34 17V7L12 2z" />
                <circle cx="12" cy="12" r="2.5" strokeWidth={1.5} />
                <line x1="12" y1="9.5" x2="12" y2="7" strokeWidth={1.5} />
                <line x1="12" y1="14.5" x2="12" y2="17" strokeWidth={1.5} />
                <line x1="9.83" y1="10.75" x2="7.5" y2="9.4" strokeWidth={1.5} />
                <line x1="14.17" y1="13.25" x2="16.5" y2="14.6" strokeWidth={1.5} />
                <line x1="9.83" y1="13.25" x2="7.5" y2="14.6" strokeWidth={1.5} />
                <line x1="14.17" y1="10.75" x2="16.5" y2="9.4" strokeWidth={1.5} />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            New Kubernetes Cluster
          </h1>
          <p className="text-base text-gray-500 mb-2">
            Build a Cluster API manifest for VMware Cloud Foundation 9.x
          </p>
          <p className="text-sm text-gray-400 mb-10">
            Configure your cluster settings and get a ready-to-apply YAML — no backend required.
          </p>

          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 px-7 py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            NEW CLUSTER
          </button>
        </div>

        {/* Feature cards */}
        <div className="max-w-3xl w-full mt-16 grid grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              title: 'Exact YAML output',
              desc: 'Produces the same YAML as VCF Automation 9.x — field for field.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              ),
              title: 'Default & Custom',
              desc: 'Start with a minimal default config or go fully custom.',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ),
              title: 'Copy or Download',
              desc: 'Copy to clipboard or download as .yaml instantly.',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sky-600 mb-3">{icon}</div>
              <div className="text-sm font-semibold text-gray-800 mb-1">{title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-100 space-y-0.5">
        <div>VCF Kubernetes Cluster Builder · Cluster API · VCF 9.x</div>
        <div>
          Built by{' '}
          <a
            href="https://github.com/lidorzx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 hover:text-sky-700 transition-colors"
          >
            Lidor Eliya
          </a>
        </div>
      </footer>
    </div>
  );
}
