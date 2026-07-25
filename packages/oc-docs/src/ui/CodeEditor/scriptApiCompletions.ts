import type { Monaco } from '@monaco-editor/react';
import type { editor, IDisposable, languages } from 'monaco-editor';
import { getScriptApiCompletions, type ScriptApiRoot } from '../../utils/scriptAutocomplete';

/**
 * Per-model API roots (`showHintsFor`). A Monaco completion provider is global
 * per language, so each script/test editor tags its own model here and the
 * shared provider reads it back — models without an entry get no suggestions.
 * Keyed weakly so entries drop when Monaco disposes the model on unmount.
 */
const modelRoots = new WeakMap<editor.ITextModel, ScriptApiRoot[]>();

let providerDisposable: IDisposable | null = null;

export const setModelHints = (model: editor.ITextModel, roots: ScriptApiRoot[]): void => {
  modelRoots.set(model, roots);
};

/** Register the shared Bruno API completion provider for JavaScript, once per Monaco instance. */
export const ensureScriptApiCompletions = (monaco: Monaco): void => {
  if (providerDisposable) return;

  // The script editors use the `javascript` language, so Monaco's built-in TS/JS language service
  // also contributes completions (DOM globals like `ReportBody`/`ReadableStream`). Those are noise
  // in a Bruno script and, because the TS worker answers asynchronously, they race the Bruno
  // provider — which shows up as flaky autocomplete on slower CI. Turn the built-in completion items
  // off so the Bruno provider is the single, synchronous source, matching this module's design
  // ("models without an entry get no suggestions").
  const jsDefaults = monaco.languages.typescript?.javascriptDefaults;
  if (jsDefaults) {
    // getModeConfiguration exists at runtime but is missing from this monaco version's types.
    const current = (jsDefaults as { getModeConfiguration?(): languages.typescript.ModeConfiguration })
      .getModeConfiguration?.() ?? {};
    jsDefaults.setModeConfiguration({ ...current, completionItems: false });
  }

  providerDisposable = monaco.languages.registerCompletionItemProvider('javascript', {
    triggerCharacters: ['.'],
    provideCompletionItems(model, position) {
      const roots = modelRoots.get(model);
      if (!roots || !roots.length) return { suggestions: [] };

      const textBeforeCaret = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });
      const labels = getScriptApiCompletions(textBeforeCaret, roots);
      if (!labels.length) return { suggestions: [] };

      const word = model.getWordUntilPosition(position);
      const range: languages.CompletionItem['range'] = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      const { Method, Field } = monaco.languages.CompletionItemKind;
      const suggestions: languages.CompletionItem[] = labels.map((label) => ({
        label,
        kind: label.endsWith(')') ? Method : Field,
        insertText: label,
        range
      }));
      return { suggestions };
    }
  });
};
