import React from 'react';
import { baseIconProps } from './baseIconProps';

export const FileNotFoundIcon: React.FC = () => (
  <svg {...baseIconProps} data-testid="file-not-found-icon">
    <path
      d="M0.833008 0.833008L15.833 15.833M4.16634 0.833008H9.99967L14.1663 4.99967V10.833M14.1663 14.1663C14.1663 14.6084 13.9907 15.0323 13.6782 15.3449C13.3656 15.6574 12.9417 15.833 12.4997 15.833H4.16634C3.72431 15.833 3.30039 15.6574 2.98783 15.3449C2.67527 15.0323 2.49967 14.6084 2.49967 14.1663V2.49967"
      transform="scale(1.44)"
      strokeWidth={1.66667 / 1.44}
    />
  </svg>
);

export default FileNotFoundIcon;
