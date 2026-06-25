import React from 'react';
import { baseIconProps } from './baseIconProps';

export const CloseIcon: React.FC = () => (
  <svg {...baseIconProps} width={18} height={18}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
