import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { TopBar } from './components/layout/TopBar';
import { YamlPanel } from './components/layout/YamlPanel';
import { ResizeHandle } from './components/layout/ResizeHandle';
import { StepNav, type Step } from './components/layout/StepNav';
import { ConfigTypeSection } from './components/sections/ConfigTypeSection';
import { DefaultSettingsSection } from './components/sections/DefaultSettingsSection';
import { GeneralSettingsSection } from './components/sections/GeneralSettingsSection';
import { ControlPlaneSection } from './components/sections/ControlPlaneSection';
import { NodePoolsSection } from './components/sections/NodePoolsSection';
import { RegistryTrustSection } from './components/sections/RegistryTrustSection';
import { ReviewSection } from './components/sections/ReviewSection';
import { useClusterClassStore } from './store/useClusterClassStore';

const PANEL_KEY = 'yamlPanelWidth';

function readSavedWidth(): number {
  let w = 460;
  try {
    const saved = Number(localStorage.getItem(PANEL_KEY));
    if (saved && saved >= 360) w = saved;
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined') {
    w = Math.min(w, Math.max(360, window.innerWidth - 420));
  }
  return Math.max(360, w);
}

interface StepDef extends Step {
  key: string;
}

const DEFAULT_STEPS: StepDef[] = [
  { key: 'config', label: 'Configuration', sub: 'Default or custom' },
  { key: 'settings', label: 'Cluster Settings', sub: 'The essentials' },
  { key: 'review', label: 'Review', sub: 'Confirm & export' },
];

const CUSTOM_STEPS: StepDef[] = [
  { key: 'config', label: 'Configuration', sub: 'Default or custom' },
  { key: 'general', label: 'General', sub: 'Name, release, compute' },
  { key: 'cp', label: 'Control Plane', sub: 'Topology & image' },
  { key: 'pools', label: 'Node Pools', sub: 'Worker pools' },
  { key: 'registry', label: 'Private Registry', sub: 'Trust & auth' },
  { key: 'review', label: 'Review', sub: 'Confirm & export' },
];

function renderStep(key: string, stepNumber: number) {
  switch (key) {
    case 'config': return <ConfigTypeSection stepNumber={stepNumber} />;
    case 'settings': return <DefaultSettingsSection stepNumber={stepNumber} />;
    case 'general': return <GeneralSettingsSection stepNumber={stepNumber} />;
    case 'cp': return <ControlPlaneSection stepNumber={stepNumber} />;
    case 'pools': return <NodePoolsSection stepNumber={stepNumber} />;
    case 'registry': return <RegistryTrustSection stepNumber={stepNumber} />;
    case 'review': return <ReviewSection stepNumber={stepNumber} />;
    default: return null;
  }
}

function App() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [panelWidth, setPanelWidthRaw] = useState<number>(readSavedWidth);
  const configType = useClusterClassStore((s) => s.configType);

  const setPanelWidth = (w: number) => {
    const clamped = Math.max(360, Math.min(w, window.innerWidth - 420));
    setPanelWidthRaw(clamped);
    try {
      localStorage.setItem(PANEL_KEY, String(clamped));
    } catch {
      /* ignore */
    }
  };

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  const steps = configType === 'default' ? DEFAULT_STEPS : CUSTOM_STEPS;
  const current = Math.min(step, steps.length - 1);
  const isLast = current === steps.length - 1;
  const active = steps[current];

  const goTo = (i: number) => setStep(Math.max(0, Math.min(i, steps.length - 1)));

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-ink-50">
      <TopBar onBack={() => setStarted(false)} />

      <div className="flex flex-1 overflow-hidden">
        <StepNav steps={steps} current={current} onSelect={goTo} />

        {/* Center: scrollable step content + sticky nav footer */}
        <main className="relative flex flex-1 flex-col overflow-hidden bg-grid-light [background-size:28px_28px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-brand-100/50 via-sky-50/40 to-transparent" />

          <div className="scroll-light relative flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-6 py-8">
              {renderStep(active.key, current + 1)}
            </div>
          </div>

          {/* Sticky navigation footer */}
          <div className="flex flex-shrink-0 items-center justify-between border-t border-ink-100 bg-white/80 px-6 py-3 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              className="ui-btn-ghost"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back
            </button>

            <span className="hidden text-xs text-ink-400 sm:block">
              Step {current + 1} of {steps.length} · <span className="font-medium text-ink-600">{active.label}</span>
            </span>

            {isLast ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
                Grab your YAML
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            ) : (
              <button type="button" onClick={() => goTo(current + 1)} className="ui-btn-primary">
                Next
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
        </main>

        <ResizeHandle onResize={setPanelWidth} />
        <YamlPanel width={panelWidth} />
      </div>
    </div>
  );
}

export default App;
