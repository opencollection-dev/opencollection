import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface ChevronArrowProps {
  open?: boolean;
  size?: number;
  className?: string;
}

export const ChevronArrow: React.FC<ChevronArrowProps> = ({ open = false, size = 13, className }) => (
  <StyledWrapper
    className={['chevron', open ? 'is-open' : '', className].filter(Boolean).join(' ')}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </StyledWrapper>
);

export default ChevronArrow;
