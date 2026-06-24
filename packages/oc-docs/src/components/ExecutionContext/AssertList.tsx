import React from 'react';
import { ScopeTag } from './ScopeTag';
import { VariableText } from '../VariableText/VariableText';
import type { AssertionRow } from '../../utils/assertions';

interface AssertListProps {
  assertions: AssertionRow[];
}

const assertionText = (assert: AssertionRow): string =>
  [assert.expression, assert.operatorLabel, assert.isUnary ? undefined : assert.value]
    .filter((part): part is string => part !== undefined && part !== '')
    .join(' ');

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
