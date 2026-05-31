import { useState, useCallback, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
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

  return (
    <div className="w-[420px] flex-shrink-0 flex flex-col h-full overflow-hidden border-l border-gray-200 bg-white">

      {/* Panel header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <span className="text-xs font-semibold text-gray-600 flex-1 truncate tracking-wide uppercase">
          Kubernetes Resource YAML
        </span>

        {/* Edit / Preview toggle */}
        <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className={`px-2 py-0.5 text-xs font-medium transition-colors ${
              !editMode ? 'bg-sky-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className={`px-2 py-0.5 text-xs font-medium transition-colors border-l border-gray-300 ${
              editMode ? 'bg-sky-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            Edit
          </button>
        </div>

        {/* Sync button — only in edit mode */}
        {editMode && (
          <button
            type="button"
            onClick={handleSyncFromForm}
            className="flex items-center gap-1 px-2 py-0.5 text-xs text-amber-700 border border-amber-300 hover:bg-amber-50 transition-colors"
            title="Reset this document to form-generated YAML"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync
          </button>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 bg-white transition-colors"
        >
          {copied ? (
            <span className="text-green-600 font-medium">Copied!</span>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-1 px-2 py-0.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 bg-white transition-colors"
          title={`Download ${active.filename}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          .yaml
        </button>
      </div>

      {/* Document tabs */}
      {tabs.length > 1 && (
        <div className="flex items-stretch gap-0 px-2 pt-1.5 border-b border-gray-200 bg-gray-50 flex-shrink-0 overflow-x-auto">
          {tabs.map((t) => {
            const isActive = t.id === active.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveId(t.id)}
                className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  isActive
                    ? 'border-sky-600 text-sky-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border-b border-amber-200 flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-xs text-amber-700">Manual edit mode — form changes won't update this document</span>
        </div>
      )}

      {/* Apply-context banner */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 border-b flex-shrink-0 ${
          active.target === 'guest'
            ? 'bg-orange-50 border-orange-200'
            : 'bg-white border-gray-100'
        }`}
      >
        <svg
          className={`w-3.5 h-3.5 flex-shrink-0 ${active.target === 'guest' ? 'text-orange-500' : 'text-sky-600'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span className={`text-xs font-medium truncate ${active.target === 'guest' ? 'text-orange-700' : 'text-sky-700'}`}>
          {active.target === 'guest'
            ? 'Apply to the GUEST cluster (workload namespace)'
            : 'Apply to the Supervisor namespace'}
        </span>
        <span className="ml-auto text-xs text-gray-400 font-mono truncate">{active.filename}</span>
      </div>

      {/* YAML content */}
      <div className="flex-1 overflow-auto">
        {editMode ? (
          <textarea
            value={edits[active.id] ?? generatedText}
            onChange={(e) => setEdits((prev) => ({ ...prev, [active.id]: e.target.value }))}
            spellCheck={false}
            className="w-full h-full min-h-full resize-none border-0 outline-none font-mono text-[0.7rem] leading-relaxed p-3 text-gray-800 bg-white"
            style={{ tabSize: 2 }}
          />
        ) : (
          <SyntaxHighlighter
            language="yaml"
            style={vs}
            showLineNumbers
            lineNumberStyle={{
              color: '#ccc',
              fontSize: '0.65rem',
              minWidth: '2.2em',
              paddingRight: '0.8em',
              userSelect: 'none',
            }}
            customStyle={{
              margin: 0,
              padding: '0.75rem 0.5rem',
              background: 'white',
              fontSize: '0.7rem',
              lineHeight: '1.6',
              minHeight: '100%',
            }}
            wrapLongLines={false}
          >
            {generatedText}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}
