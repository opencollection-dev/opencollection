import React from 'react';

/** Shared stroke styling for the empty-state icons. `currentColor` lets the icon
 * inherit the surrounding theme colour, so it adapts when the theme changes. */
const baseIconProps: React.SVGProps<SVGSVGElement> = {
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

/** Globe — empty Environments. */
export const GlobeIcon: React.FC = () => (
  <svg {...baseIconProps}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/** Book — empty Overview (readme) and empty Collection Configuration. */
export const BookIcon: React.FC = () => (
  <svg {...baseIconProps} viewBox="0 0 20 20" strokeWidth={1.667}>
    <path d="M3.334 16.25a2.083 2.083 0 0 1 2.083-2.083h11.25" />
    <path d="M5.417 1.667h11.25v16.666H5.417a2.083 2.083 0 0 1-2.083-2.083V3.75a2.083 2.083 0 0 1 2.083-2.083" />
  </svg>
);
