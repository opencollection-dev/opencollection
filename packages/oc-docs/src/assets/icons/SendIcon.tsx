import React from 'react';
import { baseIconProps } from './baseIconProps';

interface SendIconProps {
  width?: number;
  height?: number;
}

/** Paper-plane "send" icon used by the Try action. */
export const SendIcon: React.FC<SendIconProps> = ({ width = 11, height = 11 }) => (
  <svg {...baseIconProps} width={width} height={height}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
