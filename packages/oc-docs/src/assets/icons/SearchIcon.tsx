import React from 'react';
import { baseIconProps } from './baseIconProps';

/** Magnifying glass — Topbar search toggle. */
export const SearchIcon: React.FC = () => (
  <svg {...baseIconProps}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
