import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { TopBar } from './components/layout/TopBar';
import { YamlPanel } from './components/layout/YamlPanel';
import { ConfigTypeSection } from './components/sections/ConfigTypeSection';
import { DefaultSettingsSection } from './components/sections/DefaultSettingsSection';
import { GeneralSettingsSection } from './components/sections/GeneralSettingsSection';
import { ControlPlaneSection } from './components/sections/ControlPlaneSection';
import { NodePoolsSection } from './components/sections/NodePoolsSection';
import { RegistryTrustSection } from './components/sections/RegistryTrustSection';
import { ReviewSection } from './components/sections/ReviewSection';
import { TuxFollower } from './components/ui/TuxFollower';
import { useClusterClassStore } from './store/useClusterClassStore';

function App() {
  const [started, setStarted] = useState(false);
  const [showTux, setShowTux] = useState(true);
  const configType = useClusterClassStore((s) => s.configType);

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-ink-50">
      <TopBar onBack={() => setStarted(false)} showTux={showTux} onToggleTux={() => setShowTux((v) => !v)} />
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
        <YamlPanel />
      </div>

      <TuxFollower enabled={showTux} />
    </div>
  );
}

export default App;
