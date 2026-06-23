import React, { useEffect, useRef, useState } from 'react';
import { RequestDescriptionWrapper } from './StyledWrapper';

interface RequestDescriptionProps {
  /** Pre-rendered markdown HTML (from the host's markdown renderer). */
  html: string;
  /** Per-instance style overrides (e.g. page-specific spacing). */
  style?: React.CSSProperties;
  className?: string;
}

/** Animation duration; must match the CSS `max-height` transition below. */
const DURATION_MS = 280;
const PREVIEW_LINES = 3;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/** The collapsed preview height = a few lines of text. */
const previewHeight = (el: HTMLElement): number => {
  const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
  return Math.round((Number.isNaN(lineHeight) ? el.clientHeight / PREVIEW_LINES : lineHeight) * PREVIEW_LINES);
};

/**
 * Request description. Renders markdown via the shared `markdown-documentation`
 * styling (identical to the Overview page), clamps to a few lines, and reveals a
 * "View more" toggle only when the content actually overflows.
 *
 * Expanding/collapsing animates the height: the static preview stays a pure CSS
 * `-webkit-line-clamp` box (so the ellipsis recomputes natively on resize/font load);
 * the clamp is dropped only during the transition while we animate `max-height`
 * between the measured preview and full heights, then restored on completion.
 */
export const RequestDescription: React.FC<RequestDescriptionProps> = ({ html, style, className }) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [animating, setAnimating] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // The clamp is applied at rest, so clientHeight is the preview height and a taller
  // scrollHeight means there's more to reveal.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) setOverflowing(el.scrollHeight > el.clientHeight + 4);
  }, [html]);

  // Cancel any in-flight animation on unmount.
  useEffect(() => () => cleanupRef.current?.(), []);

  const toggle = () => {
    const el = bodyRef.current;
    const next = !expanded;
    if (!el || prefersReducedMotion()) {
      setExpanded(next);
      return;
    }

    // Abort any in-flight animation, then pin the current height as the start.
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
    // Fallback in case transitionend doesn't fire (≈0 delta, off-screen, etc.).
    timer = window.setTimeout(finish, DURATION_MS + 60);

    // Commit the start height, then animate to the measured target next frame.
    requestAnimationFrame(() => {
      void el.offsetHeight;
      el.style.maxHeight = `${next ? el.scrollHeight : previewHeight(el)}px`;
    });
  };

  if (!html) return null;

  return (
    <RequestDescriptionWrapper
      style={style}
      className={['oc-request-description', expanded ? 'is-expanded' : '', animating ? 'is-animating' : '', className]
        .filter(Boolean)
        .join(' ')}
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
          onClick={toggle}
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
