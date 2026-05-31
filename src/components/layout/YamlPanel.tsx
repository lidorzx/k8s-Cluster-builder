import { useState, useCallback, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useClusterClassStore } from '../../store/useClusterClassStore';
import { generateYamlDocs } from '../../lib/yaml-generator';

interface Tab {
  id: string;
  label: string;
  text: string;
  filename: string;
  target: 'supervisor' | 'guest';
}

export function YamlPanel() {
  const state = useClusterClassStore();
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeId, setActiveId] = useState('all');
  const [edits, setEdits] = useState<Record<string, string>>({});

  const docs = generateYamlDocs(state);
  const base = state.name || 'cluster';

  const fileNameFor = (id: string): string => {
    switch (id) {
      case 'trust-secret': return `${base}-registry-trust.yaml`;
      case 'pull-secret': return `${base}-pull-secret.yaml`;
      case 'cluster': return `${base}-cluster.yaml`;
      default: return `${base}-bundle.yaml`;
    }
  };

  // Build the tab list. Supervisor docs (Trust Secret + Cluster) form an apply
  // bundle; when there is more than one, an "All" tab shows them joined. The
  // guest-targeted pull secret always stands on its own.
  const supervisorDocs = docs.filter((d) => d.target === 'supervisor');
  const tabs: Tab[] = [];
  if (supervisorDocs.length > 1) {
    tabs.push({
      id: 'all',
      label: 'All (Supervisor)',
      text: supervisorDocs.map((d) => d.yamlText).join('---\n'),
      filename: `${base}-bundle.yaml`,
      target: 'supervisor',
    });
  }
  docs.forEach((d) =>
    tabs.push({ id: d.id, label: d.label, text: d.yamlText, filename: fileNameFor(d.id), target: d.target })
  );

  // Resolve the active tab, falling back gracefully if the selection no longer exists.
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  const generatedText = active.text;
  const activeText = editMode ? edits[active.id] ?? generatedText : generatedText;

  // Close edit mode when switching back to Default config
  useEffect(() => {
    if (state.configType === 'default') setEditMode(false);
  }, [state.configType]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activeText);
    } catch {
      const el = document.createElement('textarea');
      el.value = activeText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activeText]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([activeText], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = active.filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeText, active.filename]);

  const handleSyncFromForm = () =>
    setEdits((prev) => ({ ...prev, [active.id]: generatedText }));

  const darkBtn =
    'flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white';

  return (
    <div className="flex h-full w-[440px] flex-shrink-0 flex-col overflow-hidden border-l border-ink-800 bg-ink-950 text-white/90">

      {/* Panel header */}
      <div className="flex flex-shrink-0 items-center gap-2 border-b border-white/5 bg-ink-900 px-3 py-2.5">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/50">
          <span className="h-2 w-2 rounded-full bg-brand-gradient" />
          Resource YAML
        </span>

        <div className="ml-auto flex items-center gap-2">
          {/* Preview / Edit toggle */}
          <div className="flex items-center overflow-hidden rounded-md border border-white/10">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className={`px-2 py-1 text-xs font-medium transition-colors ${
                !editMode ? 'bg-brand-gradient text-white' : 'bg-transparent text-white/50 hover:bg-white/5'
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className={`border-l border-white/10 px-2 py-1 text-xs font-medium transition-colors ${
                editMode ? 'bg-brand-gradient text-white' : 'bg-transparent text-white/50 hover:bg-white/5'
              }`}
            >
              Edit
            </button>
          </div>

          {editMode && (
            <button type="button" onClick={handleSyncFromForm} className={darkBtn} title="Reset this document to form-generated YAML">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}

          <button type="button" onClick={handleCopy} className={darkBtn}>
            {copied ? (
              <span className="font-medium text-emerald-400">Copied!</span>
            ) : (
              <>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
          <button type="button" onClick={handleDownload} className={darkBtn} title={`Download ${active.filename}`}>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            .yaml
          </button>
        </div>
      </div>

      {/* Document tabs */}
      {tabs.length > 1 && (
        <div className="scroll-dark flex flex-shrink-0 items-stretch gap-1 overflow-x-auto border-b border-white/5 bg-ink-900 px-2 pt-1.5">
          {tabs.map((t) => {
            const isActive = t.id === active.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={`-mb-px whitespace-nowrap border-b-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-brand-400 text-white'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Edit mode banner */}
      {editMode && (
        <div className="flex flex-shrink-0 items-center gap-2 border-b border-amber-500/20 bg-amber-500/10 px-3 py-1.5">
          <svg className="h-3.5 w-3.5 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-xs text-amber-300">Manual edit mode — form changes won't update this document</span>
        </div>
      )}

      {/* Apply-context banner */}
      <div
        className={`flex flex-shrink-0 items-center gap-2 border-b px-3 py-1.5 ${
          active.target === 'guest'
            ? 'border-orange-500/20 bg-orange-500/10'
            : 'border-white/5 bg-brand-500/10'
        }`}
      >
        <svg
          className={`h-3.5 w-3.5 flex-shrink-0 ${active.target === 'guest' ? 'text-orange-400' : 'text-brand-300'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span className={`truncate text-xs font-medium ${active.target === 'guest' ? 'text-orange-200' : 'text-brand-200'}`}>
          {active.target === 'guest'
            ? 'Apply to the GUEST cluster (workload namespace)'
            : 'Apply to the Supervisor namespace'}
        </span>
        <span className="ml-auto truncate font-mono text-xs text-white/30">{active.filename}</span>
      </div>

      {/* YAML content */}
      <div className="scroll-dark flex-1 overflow-auto bg-ink-950">
        {editMode ? (
          <textarea
            value={edits[active.id] ?? generatedText}
            onChange={(e) => setEdits((prev) => ({ ...prev, [active.id]: e.target.value }))}
            spellCheck={false}
            className="h-full min-h-full w-full resize-none border-0 bg-ink-950 p-3 font-mono text-[0.72rem] leading-relaxed text-white/90 outline-none"
            style={{ tabSize: 2 }}
          />
        ) : (
          <SyntaxHighlighter
            language="yaml"
            style={oneDark}
            showLineNumbers
            lineNumberStyle={{
              color: 'rgb(255 255 255 / 0.2)',
              fontSize: '0.65rem',
              minWidth: '2.4em',
              paddingRight: '1em',
              userSelect: 'none',
            }}
            customStyle={{
              margin: 0,
              padding: '0.85rem 0.5rem',
              background: 'transparent',
              fontSize: '0.72rem',
              lineHeight: '1.65',
              minHeight: '100%',
            }}
            codeTagProps={{ style: { fontFamily: '"JetBrains Mono Variable", monospace' } }}
            wrapLongLines={false}
          >
            {generatedText}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}
