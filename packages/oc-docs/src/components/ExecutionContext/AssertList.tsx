import React from 'react';
import { ScopeTag } from './ScopeTag';
import { VariableText } from '../VariableText';
import type { AssertionRow } from '../../utils/assertions';

interface AssertListProps {
  assertions: AssertionRow[];
}

/** Compose an assertion into a single readable expression, e.g. `res.status equals 200`. */
const assertionText = (assert: AssertionRow): string =>
  [assert.expression, assert.operatorLabel, assert.isUnary ? undefined : assert.value]
    .filter((part): part is string => part !== undefined && part !== '')
    .join(' ');

/**
 * Static list of defined assertions (no pass/fail — this is documentation).
 * Each row shows a scope tag and the composed assertion expression in mono.
 */
export const AssertList: React.FC<AssertListProps> = ({ assertions }) => {
  if (assertions.length === 0) return null;

  return (
    <>
      {assertions.map((assert, index) => (
        <div key={`${assert.expression}-${index}`} className={`oc-assert-row${assert.disabled ? ' is-disabled' : ''}`}>
          <ScopeTag scope={assert.level} />
          <code className="oc-assert-expr">
            <VariableText value={assertionText(assert)} />
          </code>
        </div>
      ))}
    </>
  );
};

export default AssertList;
