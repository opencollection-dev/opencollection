import React from 'react';
import { SectionLabel } from '../../ui/SectionLabel/SectionLabel'
import { StyledWrapper } from './StyledWrapper';

interface SectionProps {
  label: React.ReactNode;
  children: React.ReactNode;
  testId?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ label, children, testId, className }) => (
  <StyledWrapper className={className}>
    <SectionLabel testId={testId}>{label}</SectionLabel>
    {children}
  </StyledWrapper>
);

export default Section;
