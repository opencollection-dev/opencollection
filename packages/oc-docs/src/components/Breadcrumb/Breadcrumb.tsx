import React from 'react';
import { BreadcrumbWrapper } from './StyledWrapper';

export interface BreadcrumbSegment {
  name: string;
  uuid: string;
}

interface BreadcrumbProps {
  /** Ancestor folders (clickable), ordered root → parent. */
  segments: BreadcrumbSegment[];
  /** Current page name, shown as the non-clickable trailing crumb. */
  current?: string;
  onSegmentClick?: (uuid: string) => void;
  className?: string;
}

/** Accessible breadcrumb trail (folders as buttons, current page as `aria-current`). */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ segments, current, onSegmentClick, className }) => {
  const hasSegments = segments && segments.length > 0;
  if (!hasSegments && !current) return null;

  return (
    <BreadcrumbWrapper className={['oc-breadcrumb', className].filter(Boolean).join(' ')} aria-label="Breadcrumb">
      <ol>
        {segments.map((segment, index) => (
          <li key={segment.uuid || index}>
            {index > 0 && <span className="oc-breadcrumb-sep" aria-hidden="true">›</span>}
            <button type="button" className="oc-breadcrumb-link" onClick={() => onSegmentClick?.(segment.uuid)}>
              {segment.name}
            </button>
          </li>
        ))}
        {current && (
          <li key="current" aria-current="page">
            {hasSegments && <span className="oc-breadcrumb-sep" aria-hidden="true">›</span>}
            <span className="oc-breadcrumb-current">{current}</span>
          </li>
        )}
      </ol>
    </BreadcrumbWrapper>
  );
};

export default Breadcrumb;
