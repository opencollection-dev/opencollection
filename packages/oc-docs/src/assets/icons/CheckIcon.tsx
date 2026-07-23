import React from 'react';
import { baseIconProps } from './baseIconProps';

interface CheckIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export const CheckIcon: React.FC<CheckIconProps> = ({ className, width=24, height=24 }) => (
  <svg {...baseIconProps} className={className} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6.2 5 8.4 9 3.8"
    />
  </svg>
);
