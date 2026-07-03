import React from 'react';
import { baseIconProps } from './baseIconProps';

/** Chevron down, the search palette's folder filter dropdown. */
export const ChevronDownIcon: React.FC = () => (
  <svg {...baseIconProps} width={16} height={16}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
