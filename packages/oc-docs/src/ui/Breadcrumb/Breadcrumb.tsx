import React from 'react';
import { Tooltip } from '../Tooltip/Tooltip';
import { StyledWrapper } from './StyledWrapper';

export interface BreadcrumbSegment {
  name: string;
  uuid: string;
}

// Labels are capped to a max-width; reveal the tooltip only when one is actually
// truncated (its rendered width exceeds the visible box).
const isTruncated = (anchor: HTMLElement): boolean => anchor.scrollWidth > anchor.clientWidth + 1;

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
  current?: string;
  onSegmentClick?: (uuid: string) => void;
  className?: string;
  testId?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ segments, current, onSegmentClick, className, testId = 'breadcrumb' }) => {
  const hasSegments = segments && segments.length > 0;
  if (!hasSegments && !current) return null;

  return (
    <StyledWrapper className={['breadcrumb', className].filter(Boolean).join(' ')} aria-label="Breadcrumb" data-testid={testId}>
      <ol>
        {segments.map((segment, index) => (
          <li key={segment.uuid || index}>
            {index > 0 && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
            <Tooltip content={segment.name} shouldOpen={isTruncated}>
              <button
                type="button"
                className="breadcrumb-link"
                data-testid={testId ? `${testId}-segment` : undefined}
                onClick={() => onSegmentClick?.(segment.uuid)}
              >
                {segment.name}
              </button>
            </Tooltip>
          </li>
        ))}
        {current && (
          <li key="current" aria-current="page">
            {hasSegments && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
            <Tooltip content={current} shouldOpen={isTruncated}>
              <span className="breadcrumb-current" data-testid={testId ? `${testId}-current` : undefined}>{current}</span>
            </Tooltip>
          </li>
        )}
      </ol>
    </StyledWrapper>
  );
};

export default Breadcrumb;
