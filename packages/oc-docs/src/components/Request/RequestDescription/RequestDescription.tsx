import React, { useEffect, useRef, useState } from 'react';
import { StyledWrapper } from './StyledWrapper';

interface RequestDescriptionProps {
  html: string;
  style?: React.CSSProperties;
  className?: string;
  testId?: string;
}

const DURATION_MS = 280;
const PREVIEW_MAX_HEIGHT_REM = 4.5;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

const previewHeight = (): number => {
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return Math.round(PREVIEW_MAX_HEIGHT_REM * rootFontSize);
};

export const RequestDescription: React.FC<RequestDescriptionProps> = ({ html, style, className, testId = 'request-description' }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [animating, setAnimating] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) setOverflowing(el.scrollHeight > el.clientHeight + 4);
  }, [html]);

  useEffect(() => () => cleanupRef.current?.(), []);

  const toggle = () => {
    const el = bodyRef.current;
    const next = !expanded;
    if (!el || prefersReducedMotion()) {
      setExpanded(next);
      return;
    }

    cleanupRef.current?.();
    el.style.maxHeight = `${el.clientHeight}px`;
    setAnimating(true); // drops the clamp (CSS) so full content lays out + is measurable
    setExpanded(next);

    let timer = 0;
    const finish = () => {
      el.style.maxHeight = '';
      el.removeEventListener('transitionend', onEnd);
      window.clearTimeout(timer);
      cleanupRef.current = null;
      setAnimating(false); // re-applies the clamp when collapsed
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'max-height') finish();
    };
    cleanupRef.current = finish;
    el.addEventListener('transitionend', onEnd);
    timer = window.setTimeout(finish, DURATION_MS + 60);

    requestAnimationFrame(() => {
      void el.offsetHeight;
      el.style.maxHeight = `${next ? el.scrollHeight : previewHeight()}px`;
    });
  };

  if (!html) return null;

  return (
    <StyledWrapper
      style={style}
      className={['request-description', expanded ? 'is-expanded' : '', animating ? 'is-animating' : '', className]
        .filter(Boolean)
        .join(' ')}
      data-testid={testId}
    >
      <div
        ref={bodyRef}
        className="request-description-body markdown-documentation"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {overflowing && (
        <button
          type="button"
          className="request-description-toggle"
          aria-expanded={expanded}
          data-testid={`${testId}-toggle`}
          onClick={toggle}
        >
          <span>{expanded ? 'View less' : 'View more'}</span>
          <svg
            className="request-description-chevron"
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
    </StyledWrapper>
  );
};

export default RequestDescription;
