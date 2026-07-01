import React, { useState } from 'react';
import { ScopeTag } from '../ScopeTag/ScopeTag';
import { Code } from '../../Code/Code';
import { Collapse } from '../../../ui/Collapse/Collapse';
import type { TestRow } from '../../../utils/fileUtils';
import { StyledWrapper } from './StyledWrapper';

interface TestListProps {
  tests: TestRow[];
}

const TestItem: React.FC<{ test: TestRow }> = ({ test }) => {
  const [open, setOpen] = useState(false);
  const hasCode = test.code.trim().length > 0;
  const toggle = () => {
    if (hasCode) setOpen((v) => !v);
  };

  return (
    <div className="test-row">
      <div
        className="test-head"
        role={hasCode ? 'button' : undefined}
        tabIndex={hasCode ? 0 : undefined}
        onClick={toggle}
        onKeyDown={(e) => {
          if (hasCode && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <ScopeTag scope={test.level} />
        {test.sourceName && <span className="test-source">{test.sourceName}</span>}
        <span className={['test-name', test.raw ? 'test-name--raw' : ''].filter(Boolean).join(' ')}>{test.name}</span>
        <span className="test-spacer" />
        {hasCode && (
          <button type="button" className="code-toggle" onClick={(e) => { e.stopPropagation(); toggle(); }}>
            {open ? 'hide code' : 'view code'}
          </button>
        )}
      </div>
      {hasCode && (
        <Collapse open={open} lazy>
          <div className="test-code">
            <Code code={test.code} language="javascript" surface="muted" showLineNumbers showCopy />
          </div>
        </Collapse>
      )}
    </div>
  );
};

export const TestList: React.FC<TestListProps> = ({ tests }) => {
  if (tests.length === 0) return null;

  return (
    <StyledWrapper>
      {tests.map((test, index) => (
        <TestItem key={`${test.name}-${index}`} test={test} />
      ))}
    </StyledWrapper>
  );
};

export default TestList;
