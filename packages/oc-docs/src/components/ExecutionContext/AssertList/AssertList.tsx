import React from 'react';
import { ScopeTag } from '../ScopeTag/ScopeTag';
import { DisabledBadge } from '../../DisabledBadge/DisabledBadge';
import { VariableText } from '../../VariableText/VariableText';
import { TruncatedText } from '../../TruncatedText/TruncatedText';
import { Description } from '../../Description/Description';
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
      {assertions.map((assert, index) => {
        const text = assertionText(assert);
        return (
          <div key={`${assert.expression}-${index}`} className="assert-item">
            <div className="assert-row">
              <ScopeTag scope={assert.level} />
              <code className="assert-expr">
                <TruncatedText text={text}>
                  <VariableText value={text} />
                </TruncatedText>
              </code>
              {assert.disabled ? <DisabledBadge /> : null}
            </div>
            <Description text={assert.description} />
          </div>
        );
      })}
    </StyledWrapper>
  );
};

export default AssertList;
