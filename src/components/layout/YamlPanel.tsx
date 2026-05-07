import { useState, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useClusterClassStore } from '../../store/useClusterClassStore';
import { generateYamlDocs } from '../../lib/yaml-generator';

export function YamlPanel() {
  const state = useClusterClassStore();
  const [copied, setCopied] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [treeExpanded, setTreeExpanded] = useState(true);

  const docs = generateYamlDocs(state);
  const selectedDoc = docs.find((d) => d.id === selectedDocId) ?? null;
  const yamlOutput = selectedDoc
    ? selectedDoc.yamlText
    : docs.map((d) => d.yamlText).join('\n---\n');

  const fileName = `${state.name || 'cluster'}-cluster.yaml`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(yamlOutput);
    } catch {
      const el = document.createElement('textarea');
      el.value = yamlOutput;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [yamlOutput]);

  const handleDownload = useCallback(() => {
    const full = docs.map((d) => d.yamlText).join('\n---\n');
    const blob = new Blob([full], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [docs, fileName]);

  return (
    <div className="w-[400px] flex-shrink-0 flex flex-col h-full overflow-hidden border-l border-gray-200 bg-white">

      {/* Panel header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 bg-white flex-shrink-0">
        <button
          type="button"
          onClick={() => setTreeExpanded(!treeExpanded)}
          className="text-gray-500 hover:text-gray-800 font-mono text-xs font-bold w-5 text-center"
        >
          {treeExpanded ? '»' : '«'}
        </button>
        <span className="text-sm font-semibold text-gray-700 flex-1 truncate">
          Kubernetes Resource YAML
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-sm hover:border-gray-400 bg-white transition-colors"
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
          className="flex items-center gap-1 px-2 py-0.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-sm hover:border-gray-400 bg-white transition-colors"
          title={`Download ${fileName}`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          .yaml
        </button>
      </div>

      {/* Resource tree — VCF style */}
      {treeExpanded && (
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          {/* Root node */}
          <div
            className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedDocId(null)}
          >
            <svg
              className="w-3 h-3 text-gray-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-xs font-medium text-gray-700 truncate">
              {state.name || 'cluster'}
            </span>
          </div>

          {/* All resources selected item */}
          <button
            type="button"
            onClick={() => setSelectedDocId(null)}
            className={`w-full flex items-center px-7 py-1.5 text-left text-xs transition-colors ${
              selectedDocId === null
                ? 'bg-sky-50 text-sky-800 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {state.name || 'cluster'}
          </button>
        </div>
      )}

      {/* Divider line with scrollable resource list */}
      {treeExpanded && (
        <div className="flex-shrink-0 border-b border-gray-300 bg-gray-50 max-h-36 overflow-y-auto">
          {docs.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => setSelectedDocId(doc.id === selectedDocId ? null : doc.id)}
              className={`w-full flex items-center px-4 py-1 text-left text-xs transition-colors border-b border-gray-100 last:border-b-0 ${
                selectedDocId === doc.id
                  ? 'bg-sky-50 text-sky-800 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="truncate font-mono">{doc.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* YAML content — light theme matching VCF */}
      <div className="flex-1 overflow-auto bg-white">
        {selectedDoc && (
          <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <span className="text-xs text-sky-700 font-mono font-medium">{selectedDoc.label}</span>
          </div>
        )}
        <SyntaxHighlighter
          language="yaml"
          style={vs}
          showLineNumbers
          lineNumberStyle={{
            color: '#aaa',
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
          {yamlOutput}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
