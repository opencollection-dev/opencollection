import React from 'react';
import { Tooltip } from '../../ui/Tooltip/Tooltip';
import { StyledWrapper } from './StyledWrapper';

interface InfoTipProps {
  content: string;
  testId?: string;
}

export const InfoTip: React.FC<InfoTipProps> = ({ content, testId = 'infotip' }) => (
  <Tooltip content={content}>
    <StyledWrapper type="button" aria-label={content} data-testid={testId}>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="6.75" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M6.6 6.1a1.45 1.45 0 1 1 2.05 1.4c-.5.28-.9.62-.9 1.25M8 11.4h.008"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </StyledWrapper>
  </Tooltip>
);

export default InfoTip;
