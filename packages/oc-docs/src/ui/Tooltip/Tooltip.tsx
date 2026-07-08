import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode
} from 'react';
import { Portal } from '../Portal/Portal';
import { StyledWrapper } from './StyledWrapper';

interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  disabled?: boolean;
  shouldOpen?: (anchor: HTMLElement) => boolean;
  touch?: boolean;
  interactive?: boolean;
  className?: string;
  testId?: string;
}

type Placement = 'top' | 'bottom';
interface Position {
  top: number;
  left: number;
  placement: Placement;
}

const GAP = 8; // space between the anchor and the bubble
const MARGIN = 8; // keep the bubble this far from the viewport edges

const isEmptyContent = (content: ReactNode): boolean =>
  content === undefined ||
  content === null ||
  content === '' ||
  (typeof content === 'string' && content.trim() === '');

const chain =
  <E,>(own: ((event: E) => void) | undefined, next: (event: E) => void) =>
  (event: E): void => {
    own?.(event);
    next(event);
  };

interface AnchorProps {
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onTouchStart?: React.TouchEventHandler<HTMLElement>;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  disabled = false,
  shouldOpen,
  touch = true,
  interactive = false,
  className,
  testId
}) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Position | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const computePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const bubbleWidth = bubbleRef.current?.offsetWidth ?? 0;
    const bubbleHeight = bubbleRef.current?.offsetHeight ?? 0;
    const viewportHeight = window.innerHeight;

    const roomAbove = rect.top - GAP;
    const roomBelow = viewportHeight - rect.bottom - GAP;
    let placement: Placement = 'top';
    let top = rect.top - GAP - bubbleHeight;
    if (bubbleHeight > roomAbove && (roomBelow >= bubbleHeight || roomBelow >= roomAbove)) {
      placement = 'bottom';
      top = rect.bottom + GAP;
    }
    top = Math.min(Math.max(top, MARGIN), Math.max(MARGIN, viewportHeight - MARGIN - bubbleHeight));

    let left = rect.left + rect.width / 2 - bubbleWidth / 2;
    const maxLeft = Math.max(MARGIN, window.innerWidth - MARGIN - bubbleWidth);
    left = Math.min(Math.max(left, MARGIN), maxLeft);

    setPos({ top, left, placement });
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = undefined;
    }
  }, []);

  const show = useCallback(
    (el: HTMLElement) => {
      if (disabled) return;
      if (shouldOpen && !shouldOpen(el)) return;
      clearHideTimer();
      anchorRef.current = el;
      setOpen(true);
    },
    [disabled, shouldOpen, clearHideTimer]
  );

  const hide = useCallback(() => {
    clearHideTimer();
    setOpen(false);
  }, [clearHideTimer]);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimer.current = setTimeout(() => setOpen(false), 120);
  }, [clearHideTimer]);

  useEffect(() => clearHideTimer, [clearHideTimer]);

  useEffect(() => {
    if (!open) {
      setPos(null); // reset so a reopen never paints at a stale position
      return undefined;
    }
    const initial = requestAnimationFrame(computePosition);

    let scheduled = 0;
    const reposition = () => {
      if (scheduled) return;
      scheduled = requestAnimationFrame(() => {
        scheduled = 0;
        computePosition();
      });
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };

    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(initial);
      if (scheduled) cancelAnimationFrame(scheduled);
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, computePosition, hide]);

  // Tap outside closes the tooltip on touch devices.
  useEffect(() => {
    if (!open) return undefined;
    const onOutside = (event: Event) => {
      const target = event.target as Node | null;
      if (target && anchorRef.current?.contains(target)) return;
      hide();
    };
    document.addEventListener('touchstart', onOutside, true);
    return () => document.removeEventListener('touchstart', onOutside, true);
  }, [open, hide]);

  if (disabled || isEmptyContent(content) || !isValidElement(children)) {
    return children;
  }

  const child = children as ReactElement<{
    onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
    onTouchStart?: (e: React.TouchEvent<HTMLElement>) => void;
  }>;
  const { props } = child;

  const leave = interactive ? scheduleHide : hide;
  const handlers: Record<string, (e: never) => void> = {
    onMouseEnter: chain(props.onMouseEnter, (e: React.MouseEvent<HTMLElement>) => show(e.currentTarget)),
    onMouseLeave: chain(props.onMouseLeave, leave),
    onFocus: chain(props.onFocus, (e: React.FocusEvent<HTMLElement>) => show(e.currentTarget)),
    onBlur: chain(props.onBlur, leave)
  } as Record<string, (e: never) => void>;
  if (touch) {
    handlers.onTouchStart = chain(props.onTouchStart, (e: React.TouchEvent<HTMLElement>) => {
      if (open) hide();
      else show(e.currentTarget);
    }) as (e: never) => void;
  }

  const trigger = cloneElement(child, handlers as Partial<typeof child.props>);

  return (
    <>
      {trigger}
      {open && (
        <Portal>
          <StyledWrapper
            ref={bubbleRef}
            aria-hidden="true"
            data-testid={testId}
            className={['oc-tooltip', className].filter(Boolean).join(' ')}
            onMouseEnter={interactive ? clearHideTimer : undefined}
            onMouseLeave={interactive ? hide : undefined}
            style={{
              position: 'fixed',
              top: pos ? pos.top : -9999,
              left: pos ? pos.left : -9999,
              visibility: pos ? 'visible' : 'hidden',
              ...(interactive ? { pointerEvents: 'auto' } : null)
            }}
          >
            {content}
          </StyledWrapper>
        </Portal>
      )}
    </>
  );
};

export default Tooltip;
