import React from 'react';
import { BrunoGlyph } from '../../assets/icons';
import { Base } from './StyledWrapper';

export interface OpenInBrunoButtonProps {
  /** When provided, renders a real `bruno://` deep link (`<a href>`). */
  href?: string;
  /** Click handler; used when no href is given (renders a `<button>`). */
  onClick?: () => void;
  /** Collapse to a square icon-only control. */
  iconOnly?: boolean;
  label?: string;
}

const OpenInBrunoButton: React.FC<OpenInBrunoButtonProps> = ({
  href,
  onClick,
  iconOnly = false,
  label = 'Open in Bruno',
}) => {
  const className = iconOnly ? 'is-icon' : 'is-full';
  // A real deep link renders an anchor (right-click-copy, accessible); without
  // one it falls back to a button driven by onClick.
  const tagProps = href
    ? ({ as: 'a' as const, href })
    : ({ as: 'button' as const, type: 'button' as const, onClick });

  return (
    <Base
      {...tagProps}
      className={className}
      aria-label={iconOnly ? label : undefined}
      title={label}
      data-testid="open-in-bruno"
    >
      <BrunoGlyph />
      {!iconOnly && <span>{label}</span>}
    </Base>
  );
};

export default OpenInBrunoButton;
