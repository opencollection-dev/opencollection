import React from 'react';
import { baseIconProps } from './baseIconProps';

/** Folder outline, the search palette's folder filter options. */
export const FolderIcon: React.FC = () => (
  <svg {...baseIconProps} width={16} height={16}>
    <path d="M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);
