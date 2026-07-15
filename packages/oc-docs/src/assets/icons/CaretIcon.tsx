import React from 'react';

/** Small downward caret; fills its container (e.g. the variable data-type select). */
export const CaretIcon: React.FC = () => (
  <svg viewBox="0 0 10 10" fill="none" width="100%" height="100%" aria-hidden="true" focusable="false">
    <path d="M2.5 4 5 6.5 7.5 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
