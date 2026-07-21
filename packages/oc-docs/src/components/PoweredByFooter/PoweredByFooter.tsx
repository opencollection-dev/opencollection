import React from 'react';
import { StyledWrapper } from './StyledWrapper';

const PoweredByFooter: React.FC<{ testId?: string }> = ({ testId = 'powered-by-footer' }) => (
  <StyledWrapper data-testid={testId}>
    Powered by{' '}
    <a
      className="powered-by-link"
      href="https://opencollection.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      opencollection
    </a>
  </StyledWrapper>
);

export default PoweredByFooter;
