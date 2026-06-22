import React, { useId, useState } from 'react';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import { Chevron } from '../Chevron';
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
      <StyledWrapper className={['oc-section--collapsible', className].filter(Boolean).join(' ')}>
        <div className="oc-section-head">
          <SectionLabel as={as} className="oc-section-head-label">
            <button
              type="button"
              id={labelId}
              className="oc-section-toggle"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
            >
              <Chevron open={open} className="oc-section-chevron" />
              <span className="oc-section-toggle-text">{label}</span>
            </button>
          </SectionLabel>
          {badge}
        </div>
        <div
          id={panelId}
          role="region"
          aria-labelledby={labelId}
          className={`oc-section-body${open ? ' is-open' : ''}`}
        >
          <div className="oc-section-body-clip">{children}</div>
        </div>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper className={className}>
      {badge ? (
        <div className="oc-section-head">
          <SectionLabel as={as} className="oc-section-head-label">{label}</SectionLabel>
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
