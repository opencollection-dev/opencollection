import React from 'react';
import { ScopeTag } from '../ScopeTag/ScopeTag';
import { VariableText } from '../../VariableText/VariableText';
import type { AssertionRow } from '../../../utils/assertions';
import { StyledWrapper } from './StyledWrapper';

interface AssertListProps {
  assertions: AssertionRow[];
}

/** Join an assertion into one line; unary operators (e.g. "is defined") carry no value. */
const assertionText = (assert: AssertionRow): string =>
  [assert.expression, assert.operatorLabel, assert.isUnary ? undefined : assert.value]
    .filter((part): part is string => part !== undefined && part !== '')
    .join(' ');

/** Read-only list of the request's assertions, each tagged with the scope it came from. */
export const AssertList: React.FC<AssertListProps> = ({ assertions }) => {
  if (assertions.length === 0) return null;

  return (
    <StyledWrapper>
      {assertions.map((assert, index) => (
        <div key={`${assert.expression}-${index}`} className={`assert-row${assert.disabled ? ' is-disabled' : ''}`}>
          <ScopeTag scope={assert.level} />
          <code className="assert-expr">
            <VariableText value={assertionText(assert)} />
          </code>
        </div>
      ))}
    </StyledWrapper>
  );
};

export default AssertList;
