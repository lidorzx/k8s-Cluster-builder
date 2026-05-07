import { useState, useCallback, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useClusterClassStore } from '../../store/useClusterClassStore';
import { generateYamlDocs } from '../../lib/yaml-generator';

export function YamlPanel() {
  const state = useClusterClassStore();
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedYaml, setEditedYaml] = useState('');

  const docs = generateYamlDocs(state);
  const generatedYaml = docs.map((d) => d.yamlText).join('\n---\n');
  const fileName = `${state.name || 'cluster'}-cluster.yaml`;

  // Close edit mode when switching back to Default config
  useEffect(() => {
    if (state.configType === 'default') setEditMode(false);
  }, [state.configType]);

  // When entering edit mode, seed with current generated YAML
  const handleToggleEdit = () => {
    if (!editMode) setEditedYaml(generatedYaml);
    setEditMode(!editMode);
  };

  // If form changes while NOT in edit mode keep things in sync (no-op needed)
  // If in edit mode keep user's edits — they explicitly switched to manual
  const activeYaml = editMode ? editedYaml : generatedYaml;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activeYaml);
    } catch {
      const el = document.createElement('textarea');
      el.value = activeYaml;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activeYaml]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([activeYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeYaml, fileName]);

  const handleSyncFromForm = () => setEditedYaml(generatedYaml);

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
            onClick={() => !editMode || handleToggleEdit()}
            className={`px-2 py-0.5 text-xs font-medium transition-colors ${
              !editMode ? 'bg-sky-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => editMode || handleToggleEdit()}
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
            title="Reset to form-generated YAML"
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
          title={`Download ${fileName}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          .yaml
        </button>
      </div>

      {/* Edit mode banner */}
      {editMode && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border-b border-amber-200 flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-xs text-amber-700">Manual edit mode — form changes won't update this YAML</span>
        </div>
      )}

      {/* Resource label */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-b border-gray-100 flex-shrink-0">
        <svg className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        <span className="text-xs font-mono font-medium text-sky-700 truncate">
          {state.name || 'cluster'} / Cluster
        </span>
        <span className="ml-auto text-xs text-gray-400 font-mono">{fileName}</span>
      </div>

      {/* YAML content */}
      <div className="flex-1 overflow-auto">
        {editMode ? (
          <textarea
            value={editedYaml}
            onChange={(e) => setEditedYaml(e.target.value)}
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
            {generatedYaml}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}
