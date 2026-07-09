import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { useElementWidth } from './useElementWidth';

/**
 * Strategy: render via renderToStaticMarkup (node env, no jsdom, no ResizeObserver).
 * The hook guards typeof ResizeObserver === 'undefined' and returns 0 in that case.
 * We assert the returned value is a number >= 0 and the render does not throw.
 */

function Probe({ onWidth }: { onWidth: (w: number) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const width = useElementWidth(ref);
  onWidth(width);
  return <div ref={ref} style={{ width: 500 }} data-testid="probe" />;
}

describe('useElementWidth', () => {
  it('returns a numeric width >= 0 and does not throw without ResizeObserver support', () => {
    let seen = -1;
    renderToStaticMarkup(<Probe onWidth={(w) => { seen = w; }} />);
    expect(typeof seen).toBe('number');
    expect(seen).toBeGreaterThanOrEqual(0);
  });
});
