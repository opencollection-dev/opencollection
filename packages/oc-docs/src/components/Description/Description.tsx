import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface DescriptionProps {
  text?: string;
  className?: string;
}

export const Description: React.FC<DescriptionProps> = ({ text, className }) => {
  const trimmed = text?.trim();
  return trimmed ? (
    <StyledWrapper text={trimmed} className={['description', className].filter(Boolean).join(' ')} />
  ) : null;
};

export default Description;
