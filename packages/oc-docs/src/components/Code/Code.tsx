import React, { Suspense, lazy, useEffect, useMemo, useRef } from 'react';
import { CopyButton } from '../CopyButton/CopyButton';
import { StyledWrapper } from './StyledWrapper';

import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';

const LazyCodeEditor = lazy(() => import('../../ui/CodeEditor/CodeEditor'));

interface CodeProps {
  /** Source to display (read-only) or edit. */
  code?: string;
  /** Language id for highlighting (e.g. "javascript", "json", "bash"). */
  language?: string;
  /** Read-only viewer (default) or an editable editor. */
  readOnly?: boolean;
  /** Called with the new value in editable mode. */
  onChange?: (value: string) => void;
  /** Show a line-number gutter (read-only viewer). */
  showLineNumbers?: boolean;
  /** Show the copy-to-clipboard button (read-only viewer). */
  showCopy?: boolean;
  /** Test hook (`data-testid`) applied to the copy button (read-only viewer). */
  copyTestId?: string;
  /** Editor height in editable mode. */
  height?: string;
  className?: string;
}

type CodeViewerProps = Pick<CodeProps, 'code' | 'language' | 'showLineNumbers' | 'showCopy' | 'copyTestId' | 'className'>;

/**
 * Read-only, Prism-highlighted code. Lightweight and SSR-safe (highlighting runs
 * on the client; the raw code and line numbers render server-side). Optionally
 * shows a line-number gutter and a copy-to-clipboard button.
 */
const CodeViewer: React.FC<CodeViewerProps> = ({
  code = '',
  language = 'text',
  showLineNumbers = false,
  showCopy = true,
  copyTestId,
  className
}) => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      Prism.highlightAllUnder(preRef.current);
    }
  }, [code, language]);

  const lineCount = useMemo(() => (code ? code.split('\n').length : 1), [code]);

  const wrapperClassName = ['code-content-wrapper overflow-hidden', className].filter(Boolean).join(' ');
  const codeEl = (
    <pre ref={preRef} className="m-0">
      <code className={`language-${language} font-mono`}>{code}</code>
    </pre>
  );

  return (
    <StyledWrapper className={wrapperClassName}>
      <div className="relative">
        {showCopy && <CopyButton text={code} label="Copy code" className="code-copy-floating" testId={copyTestId} />}

        {showLineNumbers ? (
          <div className="code-content-numbered">
            <div className="code-line-numbers" aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <div className="code-content code-content--numbered overflow-x-auto">{codeEl}</div>
          </div>
        ) : (
          <div className="code-content p-4 overflow-x-auto">{codeEl}</div>
        )}
      </div>
    </StyledWrapper>
  );
};

/**
 * Code surface used across the docs. Read-only by default (lightweight,
 * Prism-highlighted, SSR-safe); pass `readOnly={false}` with `onChange` to get a
 * full editor instead.
 */
export const Code: React.FC<CodeProps> = ({
  code = '',
  language = 'text',
  readOnly = true,
  onChange,
  showLineNumbers = false,
  showCopy = true,
  copyTestId,
  height = '200px',
  className
}) => {
  if (!readOnly) {
    return (
      <Suspense fallback={<div style={{ height }} aria-busy="true" />}>
        <LazyCodeEditor value={code} onChange={onChange ?? (() => {})} language={language} height={height} />
      </Suspense>
    );
  }

  return (
    <CodeViewer
      code={code}
      language={language}
      showLineNumbers={showLineNumbers}
      showCopy={showCopy}
      copyTestId={copyTestId}
      className={className}
    />
  );
};

export default Code;
