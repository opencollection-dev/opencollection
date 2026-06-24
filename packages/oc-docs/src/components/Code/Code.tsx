import React, { Suspense, lazy } from 'react';
import { CodeViewer } from './CodeViewer/CodeViewer';

const LazyCodeEditor = lazy(() => import('../../ui/CodeEditor/CodeEditor'));

interface CodeProps {
  code?: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  showLineNumbers?: boolean;
  showCopy?: boolean;
  testId?: string;
  height?: string;
  className?: string;
}

export const Code: React.FC<CodeProps> = ({
  code = '',
  language = 'text',
  readOnly = true,
  onChange,
  showLineNumbers = false,
  showCopy = true,
  testId,
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
      testId={testId}
      className={className}
    />
  );
};

export default Code;
