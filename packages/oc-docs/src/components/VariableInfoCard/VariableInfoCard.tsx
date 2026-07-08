import React, { useState } from 'react';
import { useResolvedVariables } from '../../hooks';
import { CopyButton } from '../../ui/CopyButton/CopyButton';
import { EyeIcon, EyeOffIcon } from '../../assets/icons';
import { SCOPE_LABELS, INVALID_NAME_WARNING } from '../../constants';
import { StyledWrapper } from './StyledWrapper';

interface VariableInfoCardProps {
  name: string;
  testId?: string;
}

export const VariableInfoCard: React.FC<VariableInfoCardProps> = ({ name, testId = 'variable-info-card' }) => {
  const { lookup } = useResolvedVariables();
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
    return (
      <StyledWrapper className="variable-info-card" data-testid={testId}>
        {header}
        <div className="var-readonly-note" data-testid={`${testId}-note`}>
          Generates random value on each request
        </div>
      </StyledWrapper>
    );
  }

  const readOnlyNote =
    info.scope === 'process.env' || info.scope === 'oauth2' || info.scope === '$secrets'
      ? 'read-only'
      : info.scope === 'undefined'
        ? 'No active environment'
        : null;

  const displayText = info.secret && !revealed ? '*'.repeat(info.displayValue.length) : info.displayValue;

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
              onClick={() => setRevealed((value) => !value)}
            >
              {revealed ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
          <CopyButton
            text={info.copyValue}
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
