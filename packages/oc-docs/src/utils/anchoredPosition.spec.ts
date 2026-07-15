import { describe, it, expect, vi, afterEach } from 'vitest';
import { computeAnchoredPosition } from './anchoredPosition';

// GAP and VIEWPORT_MARGIN are both 8 in constants/ui.
const anchor = (over: { top: number; bottom: number; left: number }) => over;

describe('computeAnchoredPosition', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('places the panel just below the anchor when there is room', () => {
    vi.stubGlobal('window', { innerWidth: 1000, innerHeight: 800 });
    const pos = computeAnchoredPosition(anchor({ top: 100, bottom: 120, left: 50 }), 200, 100);
    expect(pos.top).toBe(128); // bottom + GAP
    expect(pos.left).toBe(50);
  });

  it('flips above when there is not enough room below', () => {
    vi.stubGlobal('window', { innerWidth: 1000, innerHeight: 200 });
    const pos = computeAnchoredPosition(anchor({ top: 150, bottom: 170, left: 50 }), 200, 100);
    expect(pos.top).toBe(42); // top - GAP - panelHeight
  });

  it('clamps left so a panel near the right edge stays within the viewport', () => {
    vi.stubGlobal('window', { innerWidth: 1000, innerHeight: 800 });
    const pos = computeAnchoredPosition(anchor({ top: 100, bottom: 120, left: 950 }), 200, 100);
    expect(pos.left).toBe(792); // innerWidth - VIEWPORT_MARGIN - panelWidth
  });
});
