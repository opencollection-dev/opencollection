import React, { useEffect, useRef } from 'react';
import Editor, { type Monaco, type OnMount } from '@monaco-editor/react';
import { useAppSelector } from '../../store/hooks';
import { CopyButton } from '../CopyButton/CopyButton';
import { ensureScriptApiCompletions, setModelHints } from './scriptApiCompletions';
import type { ScriptApiRoot } from '../../utils/scriptAutocomplete';
import { StyledWrapper } from './StyledWrapper';

type EditorInstance = Parameters<OnMount>[0];

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
  /** Bruno API roots to autocomplete in this editor (e.g. `['req', 'bru']`); enables scripting hints. */
  hintsFor?: ScriptApiRoot[];
  /** Show a copy-to-clipboard button (revealed on hover, top-right). Defaults to on. */
  showCopy?: boolean;
  active?: boolean;
  testId?: string;
}

const LIGHT_THEME = 'oc-light';
const DARK_THEME = 'oc-dark';

const defineThemes = (monaco: Monaco) => {
  monaco.editor.defineTheme(LIGHT_THEME, {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: { 'editor.background': '#00000000', 'editorGutter.background': '#00000000' }
  });
  monaco.editor.defineTheme(DARK_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: { 'editor.background': '#00000000', 'editorGutter.background': '#00000000' }
  });
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  height = '300px',
  placeholder = '...',
  hintsFor,
  showCopy = true,
  active = true,
  testId
}) => {
  const mode = useAppSelector((s) => s.theme.mode);
  const editorRef = useRef<EditorInstance | null>(null);

  useEffect(() => {
    if (active && editorRef.current) editorRef.current.layout();
  }, [active]);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    const mono = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim();
    if (mono) editor.updateOptions({ fontFamily: mono });

    const runAction = (id: string) => {
      const action = editor.getAction(id);
      if (action) action.run();
    };
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => runAction('editor.foldAll'));
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => runAction('editor.action.joinLines'));

    if (!hintsFor?.length) return;
    ensureScriptApiCompletions(monaco);
    const model = editor.getModel();
    if (model) setModelHints(model, hintsFor);
  };

  return (
    <StyledWrapper data-testid={testId} style={{ height }}>
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(next) => onChange(next || '')}
        beforeMount={defineThemes}
        onMount={handleMount}
        theme={mode === 'dark' ? DARK_THEME : LIGHT_THEME}
        options={{
          readOnly,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 12,
          fontWeight: 'normal',
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollbar: { vertical: 'auto', horizontal: 'auto', verticalScrollbarSize: 5, horizontalScrollbarSize: 5 },
          wordWrap: 'on',
          folding: true,
          showFoldingControls: 'always',
          stickyScroll: { enabled: false },
          glyphMargin: false,
          lineDecorationsWidth: 12,
          lineNumbersMinChars: 2,
          automaticLayout: true,
          placeholder,
          renderLineHighlight: 'none',
          guides: { indentation: false, highlightActiveIndentation: false, bracketPairs: false },
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true
        }}
      />
      {showCopy && value ? (
        <CopyButton
          text={value}
          label="Copy code"
          className="code-editor-copy"
          testId={testId ? `${testId}-copy` : undefined}
        />
      ) : null}
    </StyledWrapper>
  );
};

export default CodeEditor;
