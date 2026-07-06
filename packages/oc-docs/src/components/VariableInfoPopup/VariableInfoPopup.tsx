import React from 'react';
import { SECRET_MASK } from '../../ui/SecretValue/SecretValue';
import { CopyButton } from '../../ui/CopyButton/CopyButton';
import type { VariableInfo } from '../../utils/variableInfo';
import { StyledWrapper } from './StyledWrapper';

interface VariableInfoPopupProps {
  name: string;
  info: VariableInfo | null;
}

export const VariableInfoPopup: React.FC<VariableInfoPopupProps> = ({ name, info }) => (
  <StyledWrapper className="bruno-var-info-container">
    <div className="var-info-header">
      <span className="var-name">{name}</span>
      {info ? <span className="var-scope-badge">{info.scopeLabel}</span> : null}
    </div>
    {info ? (
      <div className="var-value-container">
        <div className="var-value-display">{info.secret ? SECRET_MASK : info.value}</div>
        {!info.secret && info.value ? (
          <CopyButton text={info.value} className="var-copy" testId="variable-info-copy" />
        ) : null}
      </div>
    ) : (
      <div className="var-warning-note">Not defined in this collection</div>
    )}
  </StyledWrapper>
);

export default VariableInfoPopup;
