import React, { useState, useCallback, useEffect } from 'react';
import { Download, AlertCircle, Code, Network, Eye } from 'lucide-react';
import MonacoEditor from '@monaco-editor/react';
import SchemaExplorer from './SchemaExplorer';
import SchemaGraph from './SchemaGraph';
import { OpenCollectionSchema } from '@opencollection/schema';

const SchemaViewer = () => {
  const [schema, setSchema] = useState(null);
  const [view, setView] = useState('explorer'); // 'explorer', 'visualize', or 'source'
  const [error, setError] = useState(null);
  const [jsonInput, setJsonInput] = useState('');

  const handleJsonInput = useCallback((value) => {
    setJsonInput(value);
    try {
      if (value.trim()) {
        const parsed = JSON.parse(value);
        setSchema(parsed);
        setError(null);
      }
    } catch (err) {
      setError('Invalid JSON format');
    }
  }, []);


  const handleExport = useCallback(() => {
    if (schema) {
      const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'schema.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [schema]);


  // Load opencollection schema by default on first mount
  useEffect(() => {
    try {
      setSchema(OpenCollectionSchema);
      setJsonInput(JSON.stringify(OpenCollectionSchema, null, 2));
      setError(null);
    } catch (err) {
      setError('Failed to load opencollection schema');
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold flex items-center gap-2 dark:text-white">
              <img src="/opencollection-logo.svg" alt="OpenCollection" className="h-10 dark:invert" />
            </h1>
            
            <div className="flex items-center gap-2">
              {schema && (
                <>
                  <div className="inline-flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1" role="group">
                    <button
                      onClick={() => setView('explorer')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        view === 'explorer'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Eye className="w-4 h-4 inline mr-1.5" />
                      Explorer
                    </button>
                    <button
                      onClick={() => setView('visualize')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        view === 'visualize'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Network className="w-4 h-4 inline mr-1.5" />
                      Schema
                    </button>
                    <button
                      onClick={() => setView('source')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        view === 'source'
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Code className="w-4 h-4 inline mr-1.5" />
                      Source
                    </button>
                  </div>
                  
                  <button
                    onClick={handleExport}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-700 dark:text-white"
                  >
                    <Download className="w-4 h-4 inline mr-1" />
                    Export
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-base text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {!schema ? (
          <div className="flex-1 flex">
            <div className="flex-1 p-4">
              <div className="h-full">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Paste JSON Schema</h2>
                  <p className="text-base text-gray-600 mb-4">
                    Upload a file, load from URL, or paste your JSON Schema below
                  </p>
                </div>
                <MonacoEditor
                  height="calc(100% - 100px)"
                  language="json"
                  theme="vs-dark"
                  value={jsonInput}
                  onChange={handleJsonInput}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden min-w-0">
            {view === 'explorer' ? (
              <SchemaExplorer schema={schema} rootSchema={schema} />
            ) : view === 'visualize' ? (
              <SchemaGraph schema={schema} rootSchema={schema} />
            ) : (
              <div className="flex-1 p-4">
                <MonacoEditor
                  height="100%"
                  language="json"
                  theme="vs-dark"
                  value={JSON.stringify(schema, null, 2)}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 16,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemaViewer;