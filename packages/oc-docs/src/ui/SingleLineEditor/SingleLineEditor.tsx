import React, { useEffect, useRef, useMemo } from 'react';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, placeholder as placeholderExt, ViewUpdate } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { MatchDecorator, Decoration, ViewPlugin, DecorationSet } from '@codemirror/view';
import { useVariables } from '../HighlightedInput/VariablesContext';
import type { VariablesForHighlighting } from '../../utils/variables';
import { VARIABLE_PATTERN_SOURCE } from '../../utils/variables';
import './SingleLineEditor.css';

interface SingleLineEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  onRun?: () => void;
  variables?: VariablesForHighlighting;
}

// Create decorations for variables (static, reusable)
const validVariableMark = Decoration.mark({ class: 'cm-variable-valid' });
const invalidVariableMark = Decoration.mark({ class: 'cm-variable-invalid' });

// Variable regex - created from shared pattern source
const VARIABLE_REGEX = new RegExp(VARIABLE_PATTERN_SOURCE, 'g');

/**
 * Creates a variable highlighting plugin for CodeMirror 6
 */
const createVariableHighlighter = (variables: VariablesForHighlighting) => {
  const decorator = new MatchDecorator({
    regexp: VARIABLE_REGEX,
    decoration: (match) => {
      const varName = match[1]?.trim();
      const isValid = varName && varName in variables;
      return isValid ? validVariableMark : invalidVariableMark;
    }
  });

  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = decorator.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.decorations = decorator.updateDeco(update, this.decorations);
      }
    },
    { decorations: (v) => v.decorations }
  );
};

const SingleLineEditor: React.FC<SingleLineEditorProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  readOnly = false,
  onRun,
  variables: propVariables
}) => {
  const contextVariables = useVariables();
  const variables = propVariables ?? contextVariables;
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  const variablesKey = useMemo(() => JSON.stringify(variables), [variables]);
  const variablesRef = useRef(variables);
  variablesRef.current = variables;

  const variablesCompartment = useRef(new Compartment());
  const readOnlyCompartment = useRef(new Compartment());
  const placeholderCompartment = useRef(new Compartment());

  useEffect(() => {
    if (!editorRef.current) return;

    const initialHighlighter = createVariableHighlighter(variables);
    
    const state = EditorState.create({
      doc: value,
      extensions: [
        EditorState.transactionFilter.of((tr) => {
          if (tr.newDoc.lines > 1) {
            const newText = tr.newDoc.toString().replace(/\n/g, '');
            return {
              ...tr,
              changes: { from: 0, to: tr.startState.doc.length, insert: newText }
            };
          }
          return tr;
        }),
        history(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          {
            key: 'Enter',
            run: () => {
              onRunRef.current?.();
              return true;
            }
          },
          {
            key: 'Mod-Enter',
            run: () => {
              onRunRef.current?.();
              return true;
            }
          }
        ]),
        placeholderCompartment.current.of(placeholderExt(placeholder)),
        variablesCompartment.current.of(initialHighlighter),
        readOnlyCompartment.current.of(EditorState.readOnly.of(readOnly)),
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '12px',
            fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace)'
          },
          '.cm-content': {
            padding: '0',
            caretColor: 'var(--text-primary, #333)'
          },
          '.cm-line': {
            padding: '0'
          },
          '&.cm-focused .cm-cursor': {
            borderLeftColor: 'var(--text-primary, #333)'
          },
          '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
            backgroundColor: 'rgba(217, 119, 6, 0.2)'
          },
          '.cm-placeholder': {
            color: 'var(--text-secondary, #888)',
            fontStyle: 'normal'
          }
        }),
        EditorView.lineWrapping
      ]
    });

    const view = new EditorView({
      state,
      parent: editorRef.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentValue = view.state.doc.toString();
    if (value !== currentValue) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value }
      });
    }
  }, [value]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      effects: variablesCompartment.current.reconfigure(
        createVariableHighlighter(variablesRef.current)
      )
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variablesKey]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      effects: readOnlyCompartment.current.reconfigure(
        EditorState.readOnly.of(readOnly)
      )
    });
  }, [readOnly]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      effects: placeholderCompartment.current.reconfigure(
        placeholderExt(placeholder)
      )
    });
  }, [placeholder]);

  return (
    <div className={`single-line-editor ${className}`}>
      <div ref={editorRef} className="single-line-editor-container" />
    </div>
  );
};

SingleLineEditor.displayName = 'SingleLineEditor';

export default SingleLineEditor;
