import type { SVGProps } from 'react';

/** Shared stroke styling for the empty-state icons. `currentColor` lets the icon
 * inherit the surrounding theme colour, so it adapts when the theme changes. */
export const baseIconProps: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true
};
