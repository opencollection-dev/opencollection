import React, { useEffect, useId, useRef, useState } from 'react';
import { StyledWrapper } from './StyledWrapper';

interface ViewMoreProps {
  children: React.ReactNode;
  collapsedHeight?: string;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

const ANIMATION_MS = 260;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ViewMore: React.FC<ViewMoreProps> = ({
  children,
  collapsedHeight = '30vh',
  className,
  style,
  testId
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const collapsedPxRef = useRef(0);
  const cleanupRef = useRef<(() => void) | null>(null);
  const contentId = useId();

  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return undefined;
    const measure = () => {
      if (expanded || animating) return;
      collapsedPxRef.current = el.clientHeight;
      setOverflowing(el.scrollHeight > el.clientHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, animating]);

  useEffect(() => {
    return () => {
      const cleanup = cleanupRef.current;
      if (cleanup) cleanup();
    };
  }, []);

  const toggle = () => {
    const el = contentRef.current;
    const next = !expanded;
    if (!el || prefersReducedMotion()) {
      setExpanded(next);
      return;
    }

    const runningCleanup = cleanupRef.current;
    if (runningCleanup) runningCleanup();

    el.style.maxHeight = `${el.clientHeight}px`; // pin the current height as the animation's start
    setAnimating(true); // drops the CSS clamp so full content can lay out and be measured
    setExpanded(next);

    let timer = 0;
    const finish = () => {
      el.style.maxHeight = ''; // hand height back to CSS (clamp when collapsed, natural when expanded)
      el.removeEventListener('transitionend', onTransitionEnd);
      window.clearTimeout(timer);
      cleanupRef.current = null;
      setAnimating(false);
    };
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === 'max-height') finish();
    };
    cleanupRef.current = finish;
    el.addEventListener('transitionend', onTransitionEnd);
    timer = window.setTimeout(finish, ANIMATION_MS + 60); // fallback in case transitionend never fires

    requestAnimationFrame(() => {
      void el.offsetHeight; // force a reflow so the transition runs from the pinned height
      el.style.maxHeight = next ? `${el.scrollHeight}px` : `${collapsedPxRef.current}px`;
    });
  };

  const wrapperStyle = { ...style, '--view-more-collapsed': collapsedHeight } as React.CSSProperties;

  return (
    <StyledWrapper
      className={['view-more', overflowing ? 'is-overflowing' : '', expanded ? 'is-expanded' : '', animating ? 'is-animating' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={wrapperStyle}
      data-testid={testId}
    >
      <div ref={contentRef} id={contentId} className="view-more-content">
        {children}
      </div>
      {overflowing && (
        <button
          type="button"
          className="view-more-toggle"
          aria-expanded={expanded}
          aria-controls={contentId}
          data-testid={testId ? `${testId}-toggle` : undefined}
          onClick={toggle}
        >
          <span>{expanded ? 'View less' : 'View more'}</span>
          <svg
            className="view-more-chevron"
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

export default ViewMore;
