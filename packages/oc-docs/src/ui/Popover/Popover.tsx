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
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { StyledWrapper } from './StyledWrapper';

interface PopoverProps {
  content: ReactNode;
  children: ReactElement;
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
  className?: string;
  testId?: string;
}

interface Position {
  top: number;
  left: number;
}

interface AnchorHandlers {
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onTouchStart?: React.TouchEventHandler<HTMLElement>;
}

const ANCHOR_GAP = 8;
const VIEWPORT_MARGIN = 8;
const OFFSCREEN = -9999;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), Math.max(min, max));

/** Runs the anchor's own handler (if any) and then ours. */
const chain =
  <E,>(own: ((event: E) => void) | undefined, next: (event: E) => void) =>
  (event: E): void => {
    own?.(event);
    next(event);
  };

export const Popover: React.FC<PopoverProps> = ({
  content,
  children,
  openDelay = 60,
  closeDelay = 300,
  disabled = false,
  className,
  testId = 'popover'
}) => {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearTimer();
    setOpen(false);
    setPinned(false);
  }, [clearTimer]);

  const scheduleOpen = () => {
    clearTimer();
    timer.current = setTimeout(() => setOpen(true), openDelay);
  };

  const scheduleClose = () => {
    clearTimer();
    if (pinned) return;
    timer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  const pin = () => {
    clearTimer();
    setOpen(true);
    setPinned(true);
  };

  useEffect(() => clearTimer, [clearTimer]);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const panelWidth = panelRef.current?.offsetWidth ?? 0;
    const panelHeight = panelRef.current?.offsetHeight ?? 0;
    const { innerWidth, innerHeight } = window;

    const roomBelow = innerHeight - rect.bottom - ANCHOR_GAP;
    const roomAbove = rect.top - ANCHOR_GAP;
    const preferAbove = panelHeight > roomBelow && roomAbove > roomBelow;
    const top = preferAbove ? rect.top - ANCHOR_GAP - panelHeight : rect.bottom + ANCHOR_GAP;

    setPosition({
      top: clamp(top, VIEWPORT_MARGIN, innerHeight - VIEWPORT_MARGIN - panelHeight),
      left: clamp(rect.left, VIEWPORT_MARGIN, innerWidth - VIEWPORT_MARGIN - panelWidth)
    });
  }, []);

  useEffect(() => {
    if (!open) {
      setPosition(null);
      return undefined;
    }
    const firstFrame = requestAnimationFrame(updatePosition);
    let queuedFrame = 0;
    const reposition = () => {
      if (queuedFrame) return;
      queuedFrame = requestAnimationFrame(() => {
        queuedFrame = 0;
        updatePosition();
      });
    };
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      cancelAnimationFrame(firstFrame);
      if (queuedFrame) cancelAnimationFrame(queuedFrame);
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      const inside = !!target && (!!anchorRef.current?.contains(target) || !!panelRef.current?.contains(target));
      if (!inside) close();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open, close]);

  useEscapeKey(close, open);

  useEffect(() => {
    if (disabled) close();
  }, [disabled, close]);

  if (!isValidElement(children)) return children;

  const anchor = children as ReactElement<AnchorHandlers>;
  const anchorHandlers = anchor.props;

  const trigger = disabled
    ? anchor
    : cloneElement(anchor, {
        onMouseEnter: chain(anchorHandlers.onMouseEnter, (event) => {
          anchorRef.current = event.currentTarget;
          scheduleOpen();
        }),
        onMouseLeave: chain(anchorHandlers.onMouseLeave, scheduleClose),
        onClick: chain(anchorHandlers.onClick, (event) => {
          anchorRef.current = event.currentTarget;
          pin();
        }),
        onTouchStart: chain(anchorHandlers.onTouchStart, (event) => {
          anchorRef.current = event.currentTarget;
          if (open) close();
          else pin();
        })
      });

  return (
    <>
      {trigger}
      {open && !disabled && (
        <Portal>
          <StyledWrapper
            ref={panelRef}
            role="dialog"
            data-testid={testId}
            className={['oc-popover', className].filter(Boolean).join(' ')}
            onMouseEnter={clearTimer}
            onMouseLeave={scheduleClose}
            style={{
              position: 'fixed',
              top: position ? position.top : OFFSCREEN,
              left: position ? position.left : OFFSCREEN,
              visibility: position ? 'visible' : 'hidden'
            }}
          >
            {content}
          </StyledWrapper>
        </Portal>
      )}
    </>
  );
};

export default Popover;
