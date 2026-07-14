import { GAP, VIEWPORT_MARGIN } from '../constants/ui';

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), Math.max(min, max));

export interface AnchoredPosition {
  top: number;
  left: number;
}

/**
 * Position a portaled floating panel just below its anchor rect, flipping above when there isn't
 * enough room below, and clamp it to stay `VIEWPORT_MARGIN` inside the viewport. Shared by the
 * Popover and the HighlightedInput hover card / autocomplete so they all anchor identically.
 * Reads `window`, so call it from an effect/handler (never during SSR render).
 */
export const computeAnchoredPosition = (
  anchor: { top: number; bottom: number; left: number },
  panelWidth: number,
  panelHeight: number
): AnchoredPosition => {
  const { innerWidth, innerHeight } = window;
  const roomBelow = innerHeight - anchor.bottom - GAP;
  const roomAbove = anchor.top - GAP;
  const preferAbove = panelHeight > roomBelow && roomAbove > roomBelow;
  const top = preferAbove ? anchor.top - GAP - panelHeight : anchor.bottom + GAP;
  return {
    top: clamp(top, VIEWPORT_MARGIN, innerHeight - VIEWPORT_MARGIN - panelHeight),
    left: clamp(anchor.left, VIEWPORT_MARGIN, innerWidth - VIEWPORT_MARGIN - panelWidth)
  };
};
