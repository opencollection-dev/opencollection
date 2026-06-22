import React, { useEffect, useRef, useState } from 'react';
import { RequestDescriptionWrapper } from './StyledWrapper';

interface RequestDescriptionProps {
  /** Pre-rendered markdown HTML (from the host's markdown renderer). */
  html: string;
  /** Per-instance style overrides (e.g. page-specific spacing). */
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Request description. Renders markdown via the shared `markdown-documentation`
 * styling (identical to the Overview page), clamps to a few lines, and reveals a
 * "View more" toggle only when the content actually overflows.
 */
export const RequestDescription: React.FC<RequestDescriptionProps> = ({ html, style, className }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) setOverflowing(el.scrollHeight > el.clientHeight + 4);
  }, [html]);

  if (!html) return null;

  return (
    <RequestDescriptionWrapper
      style={style}
      className={['oc-request-description', expanded ? 'is-expanded' : '', className].filter(Boolean).join(' ')}
    >
      <div
        ref={bodyRef}
        className="oc-request-description-body markdown-documentation"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {overflowing && (
        <button
          type="button"
          className="oc-request-description-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          <span>{expanded ? 'View less' : 'View more'}</span>
          <svg
            className="oc-request-description-chevron"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </RequestDescriptionWrapper>
  );
};

export default RequestDescription;
