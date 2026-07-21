import React, { Suspense, lazy } from 'react';
import ErrorBanner from '../../../../ui/ErrorBanner/ErrorBanner';
import { useAppSelector } from '../../../../store/hooks';

// react-json-view touches browser globals at module load, so a static import
// crashes under SSR (the server bundle and the renderToStaticMarkup unit tests).
// Load it lazily and render it only in the browser (the tree is client-only —
// it appears after a request runs).
const ReactJson = lazy(() => import('@microlink/react-json-view'));

export interface JsonPreviewProps {
  data: unknown;
}

interface ParsedJson {
  value: object | null;
  error: string | null;
}

// Accepts an object/array directly, or a JSON string to parse.
const parseJson = (input: unknown): ParsedJson => {
  if (typeof input === 'object' && input !== null) {
    return { value: input, error: null };
  }

  if (typeof input === 'string') {
    try {
      const parsed: unknown = JSON.parse(input);
      if (typeof parsed === 'object' && parsed !== null) {
        return { value: parsed, error: null };
      }
      return {
        value: null,
        error: 'Data cannot be rendered as a JSON tree. Expected a JSON object or array.'
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return { value: null, error: `Invalid JSON format: ${message}` };
    }
  }

  return { value: null, error: 'Invalid input. Expected a JSON object, array, or valid JSON string.' };
};

/** Renders response data as an interactive, collapsible JSON tree. */
const JsonPreview: React.FC<JsonPreviewProps> = ({ data }) => {
  const themeMode = useAppSelector((s) => s.theme.mode);
  const { value, error } = parseJson(data);

  if (error || value === null) {
    return (
      <div className="px-2">
        <ErrorBanner
          title="Cannot preview as JSON"
          message={error ?? 'Data is null or undefined. Expected a valid JSON object or array.'}
        />
      </div>
    );
  }

  if (typeof window === 'undefined') return null;

  return (
    <Suspense fallback={null}>
      <ReactJson
        src={value}
        theme={themeMode === 'dark' ? 'monokai' : 'rjv-default'}
        collapsed={2}
        groupArraysAfterLength={10}
        displayDataTypes={false}
        displayObjectSize
        enableClipboard
        name={false}
        style={{
          backgroundColor: 'transparent',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
        }}
      />
    </Suspense>
  );
};

export default JsonPreview;
