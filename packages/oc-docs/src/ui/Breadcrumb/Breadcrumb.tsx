import React from 'react';
import { StyledWrapper } from './StyledWrapper';

export interface BreadcrumbSegment {
  name: string;
  uuid: string;
}

interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
  current?: string;
  onSegmentClick?: (uuid: string) => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ segments, current, onSegmentClick, className }) => {
  const hasSegments = segments && segments.length > 0;
  if (!hasSegments && !current) return null;

  return (
    <StyledWrapper className={['breadcrumb', className].filter(Boolean).join(' ')} aria-label="Breadcrumb">
      <ol>
        {segments.map((segment, index) => (
          <li key={segment.uuid || index}>
            {index > 0 && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
            <button type="button" className="breadcrumb-link" onClick={() => onSegmentClick?.(segment.uuid)}>
              {segment.name}
            </button>
          </li>
        ))}
        {current && (
          <li key="current" aria-current="page">
            {hasSegments && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
            <span className="breadcrumb-current">{current}</span>
          </li>
        )}
      </ol>
    </StyledWrapper>
  );
};

export default Breadcrumb;
