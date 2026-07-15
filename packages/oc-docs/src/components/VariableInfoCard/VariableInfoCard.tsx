import React from 'react';
import { useResolvedVariables } from '../../hooks';
import { CopyButton } from '../../ui/CopyButton/CopyButton';
import { SCOPE_LABELS, INVALID_NAME_WARNING } from '../../constants';
import type { VariableScope } from '../../utils/variableResolution';
import { StyledWrapper } from './StyledWrapper';

interface VariableInfoCardProps {
  name: string;
  testId?: string;
}

const getReadOnlyNote = (scope: VariableScope, activeEnvName: string | null): string | null => {
  if (scope === 'process.env' || scope === 'oauth2' || scope === '$secrets') return 'read-only';
  if (scope === 'undefined') return activeEnvName ? 'Variable is not defined' : 'No active environment';
  return null;
};

export const VariableInfoCard: React.FC<VariableInfoCardProps> = ({ name, testId = 'variable-info-card' }) => {
  const { lookup, activeEnvName } = useResolvedVariables();
  const info = lookup(name);

  const header = (
    <div className="var-info-header">
      <span className="var-name" data-testid={`${testId}-name`}>
        {info.name}
      </span>
      <span className="var-scope-badge" data-testid={`${testId}-scope`}>
        {SCOPE_LABELS[info.scope]}
      </span>
    </div>
  );

  if (!info.valid) {
    return (
      <StyledWrapper className="variable-info-card" data-testid={testId}>
        {header}
        <div className="var-warning-note" data-testid={`${testId}-warning`}>
          {INVALID_NAME_WARNING}
        </div>
      </StyledWrapper>
    );
  }

  if (info.scope === 'dynamic') {
    if (info.dynamicKind === 'unknown') {
      return (
        <StyledWrapper className="variable-info-card" data-testid={testId}>
          {header}
          <div className="var-warning-note" data-testid={`${testId}-warning`}>
            {`Unknown dynamic variable "${info.name}". Check the variable name.`}
          </div>
        </StyledWrapper>
      );
    }
    return (
      <StyledWrapper className="variable-info-card" data-testid={testId}>
        {header}
        <div className="var-readonly-note" data-testid={`${testId}-note`}>
          {info.dynamicKind === 'time'
            ? 'Generates current timestamp on each request'
            : 'Generates random value on each request'}
        </div>
      </StyledWrapper>
    );
  }

  const readOnlyNote = getReadOnlyNote(info.scope, activeEnvName);
  const placeholder = info.secret ? '(Secret)' : info.value === '' ? '(empty)' : null;

  return (
    <StyledWrapper className="variable-info-card" data-testid={testId}>
      {header}
      <div className="var-value-container">
        {placeholder ? (
          <div className="var-value-display var-value-placeholder" data-testid={`${testId}-value`}>
            {placeholder}
          </div>
        ) : (
          <>
            <div className="var-value-display" data-testid={`${testId}-value`}>
              {info.value}
            </div>
            <div className="var-icons">
              <CopyButton
                text={info.value}
                label="Copy value"
                resetAfterMs={1000}
                className="copy-button"
                testId={`${testId}-copy`}
              />
            </div>
          </>
        )}
      </div>
      {readOnlyNote && (
        <div className="var-readonly-note" data-testid={`${testId}-note`}>
          {readOnlyNote}
        </div>
      )}
    </StyledWrapper>
  );
};

export default VariableInfoCard;
