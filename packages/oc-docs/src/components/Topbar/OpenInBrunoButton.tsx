import React from 'react';
import styled from '@emotion/styled';
import { BrunoGlyph } from './icons';

export interface OpenInBrunoButtonProps {
  /** When provided, renders a real `bruno://` deep link (`<a href>`). */
  href?: string;
  /** Click handler; used when no href is given (renders a `<button>`). */
  onClick?: () => void;
  /** Collapse to a square icon-only control (tablet / mobile). */
  iconOnly?: boolean;
  label?: string;
}

const Base = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 28px;
  box-sizing: border-box;
  font-family: var(--font-sans);
  font-size: var(--oc-font-size-sm);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  color: var(--oc-brand);
  background: var(--oc-background-base);
  border: 1px solid var(--oc-brand);
  border-radius: var(--oc-border-radius-base);
  transition: background-color 0.12s ease, opacity 0.12s ease;

  svg {
    width: 16px;
    height: 16px;
    flex: none;
  }

  &:hover {
    background: color-mix(in srgb, var(--oc-brand) 8%, var(--oc-background-base));
  }

  &.is-full {
    padding: 5px 10px;
  }

  &.is-icon {
    width: 28px;
    padding: 0;
  }
`;

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
