import React from 'react';
import { baseIconProps } from './baseIconProps';

export const DockInlineIcon: React.FC = () => (
  <svg {...baseIconProps}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M14 3v18" />
  </svg>
);
