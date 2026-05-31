import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { TopBar } from './components/layout/TopBar';
import { YamlPanel } from './components/layout/YamlPanel';
import { ResizeHandle } from './components/layout/ResizeHandle';
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
  // Don't let a width saved on a big monitor overflow a smaller screen.
  if (typeof window !== 'undefined') {
    w = Math.min(w, Math.max(360, window.innerWidth - 420));
  }
  return Math.max(360, w);
}

function App() {
  const [started, setStarted] = useState(false);
  const [panelWidth, setPanelWidthRaw] = useState<number>(readSavedWidth);
  const configType = useClusterClassStore((s) => s.configType);

  const setPanelWidth = (w: number) => {
    // Keep the workspace usable on the left and the panel readable on the right.
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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-ink-50">
      <TopBar onBack={() => setStarted(false)} />
      <div className="flex flex-1 overflow-hidden">
        <main className="scroll-light relative flex-1 overflow-y-auto bg-grid-light [background-size:28px_28px]">
          {/* Soft gradient glow at the top of the workspace */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-brand-100/50 via-sky-50/40 to-transparent" />

          <div className="relative mx-auto max-w-3xl space-y-5 px-6 py-8">
            <ConfigTypeSection stepNumber={1} id="section-config-type" />

            {configType === 'default' ? (
              <>
                <DefaultSettingsSection stepNumber={2} id="section-default-settings" />
                <ReviewSection stepNumber={3} id="section-review" />
              </>
            ) : (
              <>
                <GeneralSettingsSection stepNumber={2} id="section-general" />
                <ControlPlaneSection stepNumber={3} id="section-cp" />
                <NodePoolsSection stepNumber={4} id="section-pools" />
                <RegistryTrustSection stepNumber={5} id="section-registry" />
                <ReviewSection stepNumber={6} id="section-review" />
              </>
            )}

            <div className="h-8" />
          </div>
        </main>

        <ResizeHandle onResize={setPanelWidth} />
        <YamlPanel width={panelWidth} />
      </div>
    </div>
  );
}

export default App;
