import { useEffect, useRef } from 'react';

/**
 * Calls `onEscape` when the Escape key is pressed while `active`. Shared by the
 * overlays (drawer, modal, dropdowns) so the listener isn't hand-rolled each time.
 * The handler is stashed in a ref so callers can pass an inline arrow without the
 * listener re-subscribing every render (deps stay [active]).
 */
export const useEscapeKey = (onEscape: () => void, active = true): void => {
  const handlerRef = useRef(onEscape);
  handlerRef.current = onEscape;

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handlerRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);
};
