import React from 'react';
import { StyledWrapper } from './StyledWrapper';

interface DescriptionProps {
  text?: string;
  className?: string;
}

export const Description: React.FC<DescriptionProps> = ({ text, className }) =>
  text && text.trim() ? (
    <StyledWrapper text={text} className={['oc-description', className].filter(Boolean).join(' ')} />
  ) : null;

export default Description;
