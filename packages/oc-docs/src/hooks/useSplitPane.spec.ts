import { describe, it, expect } from 'vitest';
import { computeSplitPercent } from './useSplitPane';

// computeSplitPercent(axisSize, startPos, currentPos, startPercent)
describe('computeSplitPercent', () => {
  it('moves the split by the pointer delta relative to the grab point', () => {
    // 400px axis, grabbed at 50%, pointer moves +40px → +10% → 60%
    expect(computeSplitPercent(400, 300, 340, 50)).toBe(60);
    // pointer moves -40px → -10% → 40%
    expect(computeSplitPercent(400, 300, 260, 50)).toBe(40);
  });

  it('keeps the split unchanged when the pointer has not moved', () => {
    expect(computeSplitPercent(400, 300, 300, 50)).toBe(50);
  });

  it('clamps below 20% and above 80%', () => {
    expect(computeSplitPercent(400, 300, 0, 50)).toBe(20);
    expect(computeSplitPercent(400, 300, 800, 50)).toBe(80);
  });

  it('returns the starting percent when the axis has no size', () => {
    expect(computeSplitPercent(0, 300, 340, 50)).toBe(50);
  });
});
