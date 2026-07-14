import { GAP, VIEWPORT_MARGIN } from '../constants/ui';

// Clamp `value` to [min, max]. The Math.max(min, max) guards an inverted range: when the panel is
// larger than the space available (max < min), the result pins to `min` instead of flipping the bounds.
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
  anchorRect: { top: number; bottom: number; left: number },
  panelWidth: number,
  panelHeight: number
): AnchoredPosition => {
  const { innerWidth, innerHeight } = window;

  const roomBelow = innerHeight - anchorRect.bottom - GAP;
  const roomAbove = anchorRect.top - GAP;
  const flipAbove = panelHeight > roomBelow && roomAbove > roomBelow;
  const top = flipAbove ? anchorRect.top - GAP - panelHeight : anchorRect.bottom + GAP;

  const maxTop = innerHeight - VIEWPORT_MARGIN - panelHeight;
  const maxLeft = innerWidth - VIEWPORT_MARGIN - panelWidth;
  return {
    top: clamp(top, VIEWPORT_MARGIN, maxTop),
    left: clamp(anchorRect.left, VIEWPORT_MARGIN, maxLeft)
  };
};
