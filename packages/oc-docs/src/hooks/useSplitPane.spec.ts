import { describe, it, expect } from 'vitest';
import { computeSplitPercent } from './useSplitPane';

const rect = { left: 100, top: 50, width: 400, height: 200 };

describe('computeSplitPercent', () => {
  it('maps X within the container to a percentage in horizontal mode', () => {
    expect(computeSplitPercent(rect, 300, 0, 'horizontal')).toBe(50);
    expect(computeSplitPercent(rect, 200, 0, 'horizontal')).toBe(25);
  });

  it('maps Y within the container to a percentage in vertical mode', () => {
    expect(computeSplitPercent(rect, 0, 150, 'vertical')).toBe(50);
    expect(computeSplitPercent(rect, 0, 100, 'vertical')).toBe(25);
  });

  it('clamps below 20% and above 80%', () => {
    expect(computeSplitPercent(rect, 100, 0, 'horizontal')).toBe(20);
    expect(computeSplitPercent(rect, 500, 0, 'horizontal')).toBe(80);
    expect(computeSplitPercent(rect, 0, 50, 'vertical')).toBe(20);
    expect(computeSplitPercent(rect, 0, 250, 'vertical')).toBe(80);
  });
});
