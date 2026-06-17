import React from 'react';
import { StyledButton } from './StyledWrapper';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label — icon buttons have no visible text. */
  label: string;
}

/**
 * Icon-only button primitive (aria-label required, no text). Shared across the
 * app — used for the Topbar hamburger, search toggle, overflow ⋯, etc. Extra
 * ARIA / button props (aria-expanded, aria-haspopup, onClick…) pass through.
 */
const IconButton: React.FC<IconButtonProps> = ({ label, children, type = 'button', ...rest }) => (
  <StyledButton type={type} aria-label={label} {...rest}>
    {children}
  </StyledButton>
);

export default IconButton;
