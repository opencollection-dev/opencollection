import React, { useId, useState } from 'react';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import { ChevronArrow } from '../ChevronArrow/ChevronArrow';
import { Collapse } from '../Collapse/Collapse';
import { StyledWrapper } from './StyledWrapper';

type HeadingLevel = 'h2' | 'h3' | 'h4';

interface SectionProps {
  label: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  testId?: string;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  as?: HeadingLevel;
}

export const Section: React.FC<SectionProps> = ({
  label,
  badge,
  children,
  testId,
  className,
  collapsible = false,
  defaultOpen = true,
  as = 'h2'
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const labelId = useId();

  if (collapsible) {
    return (
      <StyledWrapper className={['section--collapsible', className].filter(Boolean).join(' ')} data-testid={testId}>
        <div className="section-head">
          <SectionLabel as={as} className="section-head-label">
            <button
              type="button"
              id={labelId}
              className="section-toggle"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
            >
              <ChevronArrow open={open} className="section-chevron" />
              <span className="section-toggle-text">{label}</span>
            </button>
          </SectionLabel>
          {badge}
        </div>
        <Collapse open={open} id={panelId} role="region" aria-labelledby={labelId}>
          {children}
        </Collapse>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper className={className} data-testid={testId}>
      {badge ? (
        <div className="section-head">
          <SectionLabel as={as} className="section-head-label">{label}</SectionLabel>
          {badge}
        </div>
      ) : (
        <SectionLabel as={as}>{label}</SectionLabel>
      )}
      {children}
    </StyledWrapper>
  );
};

export default Section;
