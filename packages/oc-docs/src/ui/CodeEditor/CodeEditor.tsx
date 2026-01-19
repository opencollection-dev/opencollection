import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import Editor, { type Monaco, type OnMount } from '@monaco-editor/react';
import type { editor, IDisposable } from 'monaco-editor';
import { useVariables } from '../HighlightedInput/VariablesContext';
import { createVariableRegex, isVariableDefined, type VariablesForHighlighting } from '../../utils/variables';
import './CodeEditor.css';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  /** Enable variable highlighting for {{variables}} */
  enableVariableHighlighting?: boolean;
  /** Override variables from context */
  variables?: VariablesForHighlighting;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  height = '300px',
  enableVariableHighlighting = false,
  variables: propVariables
}) => {
  const contextVariables = useVariables();
  const variables = propVariables ?? contextVariables;
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const contentChangeDisposableRef = useRef<IDisposable | null>(null);

  const variablesKey = useMemo(() => JSON.stringify(variables), [variables]);
  const variablesRef = useRef(variables);
  variablesRef.current = variables;

  const handleChange = useCallback((newValue: string | undefined) => {
    onChange(newValue || '');
  }, [onChange]);

  const updateDecorations = useCallback(() => {
    const editorInstance = editorRef.current;
    const monaco = monacoRef.current;

    if (!editorInstance || !monaco || !enableVariableHighlighting) {
      return;
    }

    const model = editorInstance.getModel();
    if (!model) return;

    const currentVariables = variablesRef.current;
    const text = model.getValue();
    const newDecorations: editor.IModelDeltaDecoration[] = [];
    const regex = createVariableRegex();
    let match;

    while ((match = regex.exec(text)) !== null) {
      const variableName = match[1].trim();
      const isValid = isVariableDefined(variableName, currentVariables);
      const startPos = model.getPositionAt(match.index);
      const endPos = model.getPositionAt(match.index + match[0].length);

      newDecorations.push({
        range: new monaco.Range(
          startPos.lineNumber,
          startPos.column,
          endPos.lineNumber,
          endPos.column
        ),
        options: {
          inlineClassName: isValid
            ? 'monaco-variable-valid'
            : 'monaco-variable-invalid',
          hoverMessage: {
            value: isValid
              ? `**${variableName}**: \`${currentVariables[variableName] ?? ''}\``
              : `⚠️ Variable \`${variableName}\` is not defined`
          }
        }
      });
    }

    decorationsRef.current = editorInstance.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [enableVariableHighlighting]);

  const handleEditorDidMount: OnMount = useCallback((editorInstance, monaco) => {
    editorRef.current = editorInstance;
    monacoRef.current = monaco;
    updateDecorations();
    contentChangeDisposableRef.current = editorInstance.onDidChangeModelContent(() => {
      updateDecorations();
    });
  }, [updateDecorations]);

  useEffect(() => {
    return () => {
      contentChangeDisposableRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    updateDecorations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variablesKey, updateDecorations]);

  useEffect(() => {
    const frameId = requestAnimationFrame(updateDecorations);
    return () => cancelAnimationFrame(frameId);
  }, [value, updateDecorations]);

  return (
    <div 
      className="code-editor-container"
      style={{ 
        height, 
        width: '100%',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="vs"
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
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

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor; 