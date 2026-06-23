import React, { useEffect, useState } from 'react';
import { CollapseWrapper } from './StyledWrapper';

interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the panel is open (controlled by the caller). */
  open: boolean;
  /**
   * Mount children only on/after the first open, then keep them mounted. Use for
   * heavy content (e.g. syntax-highlighted code) so it isn't built until first shown
   * and isn't re-built on every re-open.
   */
  lazy?: boolean;
  /** Class applied to the inner clip element (put any padding/background here). */
  innerClassName?: string;
  children: React.ReactNode;
}

/**
 * Reusable open/close animation for accordions. Renders a grid track that animates
 * `0fr → 1fr` with an overflow-hidden clip — no fixed heights, no JS measurement, so
 * it's SSR-safe and reduced-motion-aware. The caller owns the open state, the toggle
 * control and (optionally) a {@link Chevron}; any `id`/`role`/`aria-*` passed through
 * land on the outer element (so a collapsible `Section` keeps its labelled region).
 *
 * Keep padding and backgrounds on `innerClassName` (the clip), never on the outer
 * grid — padding on the track would leak height while closed.
 */
export const Collapse: React.FC<CollapseProps> = ({ open, lazy = false, innerClassName, children, className, ...rest }) => {
  const [everOpened, setEverOpened] = useState(open);
  useEffect(() => {
    if (open) setEverOpened(true);
  }, [open]);

  return (
    <CollapseWrapper {...rest} className={['oc-collapse', open ? 'is-open' : '', className].filter(Boolean).join(' ')}>
      <div className={['oc-collapse-clip', innerClassName].filter(Boolean).join(' ')}>
        {!lazy || everOpened ? children : null}
      </div>
    </CollapseWrapper>
  );
};

export default Collapse;
