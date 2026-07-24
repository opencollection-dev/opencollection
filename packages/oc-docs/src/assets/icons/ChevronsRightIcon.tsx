import React from 'react';

export const ChevronsRightIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="7 7 12 12 7 17" />
    <polyline points="13 7 18 12 13 17" />
  </svg>
);

export default ChevronsRightIcon;
