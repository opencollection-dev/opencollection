import React from 'react';
import { baseIconProps } from './baseIconProps';

interface SidebarToggleIconProps {
  /** Fills the sidebar column when the playground sidebar is open. */
  active?: boolean;
}

export const SidebarToggleIcon: React.FC<SidebarToggleIconProps> = ({ active = false }) => (
  <svg {...baseIconProps}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 3v18" />
    {active && <rect x="3" y="3.75" width="6" height="16.5" fill="currentColor" stroke="none" />}
  </svg>
);
