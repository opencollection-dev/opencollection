import React from 'react';
import { baseIconProps } from './baseIconProps';

export const EyeIcon: React.FC = () => (
  <svg {...baseIconProps}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
