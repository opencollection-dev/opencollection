import React from 'react';
import { SectionLabel } from '../SectionLabel/SectionLabel'
import { SectionWrapper } from './StyledWrapper';

interface SectionProps {
  label: React.ReactNode;
  children: React.ReactNode;
  testId?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ label, children, testId, className }) => (
  <SectionWrapper className={className}>
    <SectionLabel testId={testId}>{label}</SectionLabel>
    {children}
  </SectionWrapper>
);

export default Section;
