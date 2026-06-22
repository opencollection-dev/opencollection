import React from 'react';
import { baseIconProps } from './baseIconProps';

/** Book — empty Overview (readme) and empty Collection Configuration. */
export const BookIcon: React.FC = () => (
  <svg {...baseIconProps} viewBox="0 0 20 20" strokeWidth={1.667}>
    <path d="M3.334 16.25a2.083 2.083 0 0 1 2.083-2.083h11.25" />
    <path d="M5.417 1.667h11.25v16.666H5.417a2.083 2.083 0 0 1-2.083-2.083V3.75a2.083 2.083 0 0 1 2.083-2.083" />
  </svg>
);
