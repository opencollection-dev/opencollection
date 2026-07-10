import React, { useId } from 'react';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import { ChevronArrow } from '../ChevronArrow/ChevronArrow';
import { Collapse } from '../../ui/Collapse/Collapse';
import { useSessionStorage } from '../../hooks';
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
  storageKey?: string;
  as?: HeadingLevel;
}

export const Section: React.FC<SectionProps> = ({
  label,
  badge,
  children,
  testId = 'section',
  className,
  collapsible = false,
  defaultOpen = true,
  storageKey,
  as = 'h2'
}) => {
  const [open, setOpen] = useSessionStorage(storageKey ? `section-${storageKey}` : '', defaultOpen);
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
