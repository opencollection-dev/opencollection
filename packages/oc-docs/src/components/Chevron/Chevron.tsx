import React from 'react';
import { ChevronIcon } from './StyledWrapper';

interface ChevronProps {
  /** When true the chevron rotates 90° to point down (expanded state). */
  open?: boolean;
  /** Icon size in pixels (width = height). Defaults to 13. */
  size?: number;
  className?: string;
}

/**
 * Small disclosure chevron shared by collapsible sections and rows. Purely
 * decorative (aria-hidden) — the control that owns it carries the accessible
 * state via `aria-expanded`.
 */
export const Chevron: React.FC<ChevronProps> = ({ open = false, size = 13, className }) => (
  <ChevronIcon
    className={['oc-chevron', open ? 'is-open' : '', className].filter(Boolean).join(' ')}
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
  </ChevronIcon>
);

export default Chevron;
