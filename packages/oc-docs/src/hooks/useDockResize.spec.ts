import { describe, it, expect } from 'vitest';
import { computeResizeDelta } from './useDockResize';

describe('computeResizeDelta', () => {
  it('grows a leading panel (left sidebar) as the pointer moves away from the origin', () => {
    expect(computeResizeDelta('leading', 260, 320)).toBe(60);
  });

  it('shrinks a leading panel as the pointer moves back toward the origin', () => {
    expect(computeResizeDelta('leading', 260, 210)).toBe(-50);
  });

  it('grows a trailing panel (right/bottom dock) as the pointer moves toward the origin', () => {
    expect(computeResizeDelta('trailing', 400, 340)).toBe(60);
  });

  it('is zero when the pointer has not moved', () => {
    expect(computeResizeDelta('leading', 260, 260)).toBe(0);
    expect(computeResizeDelta('trailing', 260, 260)).toBe(0);
  });
});
