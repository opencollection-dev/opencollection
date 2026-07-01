import React from 'react';
import { OpenCollectionWordmark } from '../../../../assets/OpenCollectionWordmark';
import ThemeToggle from '../../../ThemeToggle/ThemeToggle';
import { StyledWrapper } from './StyledWrapper';

const SidebarFooter: React.FC = () => (
  <StyledWrapper data-testid="sidebar-footer">
    <span className="footer-by">
      Powered by
      <a
        className="footer-link"
        href="https://opencollection.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <OpenCollectionWordmark className="footer-logo" />
      </a>
    </span>
    <ThemeToggle />
  </StyledWrapper>
);

export default SidebarFooter;
