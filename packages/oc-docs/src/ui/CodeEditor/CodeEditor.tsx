import React from 'react';
import Editor from '@monaco-editor/react';
import { useAppSelector } from '../../store/hooks';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  height = '300px'
}) => {
  const mode = useAppSelector((s) => s.theme.mode);

  const handleChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  return (
    <div style={{
      height,
      width: '100%',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--oc-radius)',
      overflow: 'hidden'
    }}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleChange}
        theme={mode === 'dark' ? 'vs-dark' : 'vs'}
        beforeMount={(monaco) => monaco.languages.json?.jsonDefaults?.setDiagnosticsOptions({ validate: false })}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          renderLineHighlight: 'none',
          guides: { indentation: false },
          overviewRulerLanes: 0,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto'
          },
          wordWrap: 'on',
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
