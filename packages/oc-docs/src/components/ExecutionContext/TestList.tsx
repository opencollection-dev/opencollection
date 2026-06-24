import React, { useState } from 'react';
import { ScopeTag } from './ScopeTag';
import { Code } from '../Code/Code';
import { Collapse } from '../Collapse';
import type { TestRow } from '../../utils/extractTests';

interface TestListProps {
  tests: TestRow[];
}

/** One test row: scope tag + mono name, expandable to reveal the test's own source. */
const TestItem: React.FC<{ test: TestRow }> = ({ test }) => {
  const [open, setOpen] = useState(false);
  // A parsed title with no captured body (unusual) simply has no code to reveal.
  const hasCode = test.code.trim().length > 0;
  const toggle = () => {
    if (hasCode) setOpen((v) => !v);
  };

  return (
    <div className="oc-test-row">
      <div
        className="oc-test-head"
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
        <span className="oc-test-name">{test.name}</span>
        <span className="oc-test-spacer" />
        {hasCode && (
          <button type="button" className="oc-code-toggle" onClick={(e) => { e.stopPropagation(); toggle(); }}>
            {open ? 'hide code' : 'view code'}
          </button>
        )}
      </div>
      {hasCode && (
        // Padding lives on an inner div (like ScriptStep), never on the Collapse clip:
        // a grid item's padding isn't removed by min-height:0, so padding on the clip
        // keeps the collapsed 0fr track from shrinking to zero and the code panel leaks.
        <Collapse open={open} lazy>
          <div className="oc-test-code">
            <Code code={test.code} language="javascript" surface="muted" showLineNumbers showCopy={false} />
          </div>
        </Collapse>
      )}
    </div>
  );
};

/** Static list of test titles parsed from `test()`/`it()` blocks, with scope tags. */
export const TestList: React.FC<TestListProps> = ({ tests }) => {
  if (tests.length === 0) return null;

  return (
    <>
      {tests.map((test, index) => (
        <TestItem key={`${test.name}-${index}`} test={test} />
      ))}
    </>
  );
};

export default TestList;
