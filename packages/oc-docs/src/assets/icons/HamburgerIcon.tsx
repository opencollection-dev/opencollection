import React from 'react';
import { baseIconProps } from './baseIconProps';

/** Three bars — Topbar sidebar (hamburger) toggle. */
export const HamburgerIcon: React.FC = () => (
  <svg {...baseIconProps}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);
