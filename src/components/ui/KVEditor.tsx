

interface KVEditorProps {
  label?: string;
  pairs: Record<string, string>;
  onChange: (pairs: Record<string, string>) => void;
}

export function KVEditor({ label, pairs, onChange }: KVEditorProps) {
  const entries = Object.entries(pairs);

  const handleKeyChange = (oldKey: string, newKey: string) => {
    const newPairs: Record<string, string> = {};
    for (const [k, v] of Object.entries(pairs)) {
      if (k === oldKey) {
        newPairs[newKey] = v;
      } else {
        newPairs[k] = v;
      }
    }
    onChange(newPairs);
  };

  const handleValueChange = (key: string, value: string) => {
    onChange({ ...pairs, [key]: value });
  };

  const handleAdd = () => {
    const newKey = `key${entries.length + 1}`;
    onChange({ ...pairs, [newKey]: '' });
  };

  const handleRemove = (key: string) => {
    const newPairs = { ...pairs };
    delete newPairs[key];
    onChange(newPairs);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <button
          type="button"
          onClick={handleAdd}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>
      {entries.length === 0 && (
        <p className="text-xs text-gray-400 italic">No entries. Click Add to create one.</p>
      )}
      {entries.map(([key, value]) => (
        <div key={key} className="flex gap-2 items-center">
          <input
            type="text"
            value={key}
            onChange={(e) => handleKeyChange(key, e.target.value)}
            placeholder="Key"
            className="flex-1 text-sm rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-w-0"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => handleValueChange(key, e.target.value)}
            placeholder="Value"
            className="flex-1 text-sm rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-w-0"
          />
          <button
            type="button"
            onClick={() => handleRemove(key)}
            className="text-gray-400 hover:text-red-500 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
