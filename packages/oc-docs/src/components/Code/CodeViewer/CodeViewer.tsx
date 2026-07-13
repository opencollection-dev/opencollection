import React, { useEffect, useMemo, useRef } from 'react';
import { CopyButton } from '@ui/CopyButton/CopyButton';
import { StyledWrapper } from './StyledWrapper';

import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-xml-doc';

export interface CodeViewerProps {
  code?: string;
  language?: string;
  showLineNumbers?: boolean;
  showCopy?: boolean;
  testId?: string;
  className?: string;
}

const LineNumbers: React.FC<{ count: number }> = ({ count }) => (
  <div className="code-line-numbers" aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <span key={i}>{i + 1}</span>
    ))}
  </div>
);

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code = '',
  language = 'text',
  showLineNumbers = false,
  showCopy = true,
  testId,
  className
}) => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      Prism.highlightAllUnder(preRef.current);
    }
  }, [code, language]);

  const lineCount = useMemo(() => (code ? code.split('\n').length : 1), [code]);

  const codeEl = (
    <pre ref={preRef} className="m-0">
      <code className={`language-${language} font-mono`}>{code}</code>
    </pre>
  );

  return (
    <StyledWrapper className={['code-content-wrapper overflow-hidden', className].filter(Boolean).join(' ')}>
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
            <LineNumbers count={lineCount} />
            <div className="code-content code-content--numbered overflow-x-auto">{codeEl}</div>
          </div>
        ) : (
          <div className="code-content p-4 overflow-x-auto">{codeEl}</div>
        )}
      </div>
    </StyledWrapper>
  );
};

export default CodeViewer;
