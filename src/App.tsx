import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { TopBar } from './components/layout/TopBar';
import { YamlPanel } from './components/layout/YamlPanel';
import { ConfigTypeSection } from './components/sections/ConfigTypeSection';
import { DefaultSettingsSection } from './components/sections/DefaultSettingsSection';
import { GeneralSettingsSection } from './components/sections/GeneralSettingsSection';
import { ControlPlaneSection } from './components/sections/ControlPlaneSection';
import { NodePoolsSection } from './components/sections/NodePoolsSection';
import { ReviewSection } from './components/sections/ReviewSection';
import { useClusterClassStore } from './store/useClusterClassStore';

function App() {
  const [started, setStarted] = useState(false);
  const configType = useClusterClassStore((s) => s.configType);

  if (!started) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <TopBar onBack={() => setStarted(false)} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-white divide-y divide-gray-100">
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
              <ReviewSection stepNumber={5} id="section-review" />
            </>
          )}

          <div className="h-10" />
        </main>
        <YamlPanel />
      </div>
    </div>
  );
}

export default App;
