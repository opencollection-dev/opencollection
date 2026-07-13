import React, { useState } from 'react';
import { useResolvedVariables } from '../../hooks';
import { CopyButton } from '../../ui/CopyButton/CopyButton';
import { EyeIcon, EyeOffIcon } from '../../assets/icons';
import { SCOPE_LABELS, INVALID_NAME_WARNING, SECRET_MASK } from '../../constants';
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
  const [revealed, setRevealed] = useState(false);

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

  const displayText = info.secret && !revealed ? SECRET_MASK : info.value;

  return (
    <StyledWrapper className="variable-info-card" data-testid={testId}>
      {header}
      <div className="var-value-container">
        <div className="var-value-display" data-testid={`${testId}-value`}>
          {displayText}
        </div>
        <div className="var-icons">
          {info.secret && (
            <button
              type="button"
              className="secret-toggle-button"
              aria-pressed={revealed}
              aria-label={revealed ? 'Hide value' : 'Show value'}
              data-testid={`${testId}-reveal`}
              onClick={() => setRevealed((prev) => !prev)}
            >
              {revealed ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
          <CopyButton
            text={info.value}
            label="Copy value"
            resetAfterMs={1000}
            className="copy-button"
            testId={`${testId}-copy`}
          />
        </div>
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
