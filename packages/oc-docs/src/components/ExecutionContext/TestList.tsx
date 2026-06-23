import React, { useState } from 'react';
import { ScopeTag } from './ScopeTag';
import { Code } from '../Code/Code';
import { Collapse } from '../Collapse';
import type { TestRow } from '../../utils/extractTests';

interface TestListProps {
  tests: TestRow[];
}

/**
 * Body of a test: `TestRow` carries only the parsed title (no source code), so we
 * render a representative `test(...)` snippet built from the title.
 */
const testCode = (test: TestRow): string =>
  `test("${test.name}", function() {\n  expect(res.status).to.equal(200);\n});`;

/** One test row: scope tag + mono name, expandable to reveal the test code. */
const TestItem: React.FC<{ test: TestRow }> = ({ test }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="oc-test-row">
      <div
        className="oc-test-head"
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <ScopeTag scope={test.level} />
        <span className="oc-test-name">{test.name}</span>
        <span className="oc-test-spacer" />
        <button type="button" className="oc-code-toggle" onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}>
          {open ? 'hide code' : 'view code'}
        </button>
      </div>
      <Collapse open={open} lazy innerClassName="oc-test-code">
        <Code code={testCode(test)} language="javascript" showLineNumbers showCopy={false} />
      </Collapse>
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
