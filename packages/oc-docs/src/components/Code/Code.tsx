import React, { Suspense, lazy, useEffect, useMemo, useRef } from 'react';
import { CopyButton } from '../../ui/CopyButton/CopyButton';
import { StyledWrapper } from './CodeViewer/StyledWrapper';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';

const LazyCodeEditor = lazy(() => import('../../ui/CodeEditor/CodeEditor'));

interface CodeProps {
  code?: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  showLineNumbers?: boolean;
  showCopy?: boolean;

  surface?: 'base' | 'muted';
  testId?: string;
  height?: string;
  className?: string;
}

type CodeViewerProps = Pick<CodeProps, 'code' | 'language' | 'showLineNumbers' | 'showCopy' | 'surface' | 'className' | 'testId'>;

const CodeViewer: React.FC<CodeViewerProps> = ({
  code = '',
  language = 'text',
  showLineNumbers = false,
  showCopy = true,
  surface = 'base',
  className,
  testId
}) => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      Prism.highlightAllUnder(preRef.current);
    }
  }, [code, language]);

  const lineCount = useMemo(() => (code ? code.split('\n').length : 1), [code]);

  const wrapperClassName = ['code-content-wrapper overflow-hidden', surface === 'muted' ? 'code--muted' : '', className]
    .filter(Boolean)
    .join(' ');
  const codeEl = (
    <pre ref={preRef} className="m-0">
      <code className={`language-${language} font-mono`}>{code}</code>
    </pre>
  );

  return (
    <StyledWrapper className={wrapperClassName} data-testid={testId}>
      <div className="relative">
        {showCopy && (
          <CopyButton
            text={code}
            label="Copy code"
            className="code-copy-floating"
            testId={testId ? `${testId}-copy` : undefined}
          />
        )}

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

export const Code: React.FC<CodeProps> = ({
  code = '',
  language = 'text',
  readOnly = true,
  onChange,
  showLineNumbers = false,
  showCopy = true,
  surface = 'base',
  height = '200px',
  className,
  testId = 'code'
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
      surface={surface}
      className={className}
      testId={testId}
    />
  );
};

export default Code;
