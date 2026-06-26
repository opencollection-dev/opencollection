import { describe, it, expect } from 'vitest';
import {
  layoutModeForWidth,
  showsHamburger,
  TOPBAR_TABLET_MIN,
  TOPBAR_DESKTOP_MIN,
} from './useTopbarLayout';

describe('layoutModeForWidth', () => {
  it('maps wide viewports to desktop (>=1024)', () => {
    expect(layoutModeForWidth(TOPBAR_DESKTOP_MIN)).toBe('desktop');
    expect(layoutModeForWidth(1280)).toBe('desktop');
  });

  it('maps the 768–1023 band to tablet', () => {
    expect(layoutModeForWidth(TOPBAR_TABLET_MIN)).toBe('tablet');
    expect(layoutModeForWidth(1023)).toBe('tablet');
  });

  it('maps narrow viewports to mobile (<768)', () => {
    expect(layoutModeForWidth(TOPBAR_TABLET_MIN - 1)).toBe('mobile');
    expect(layoutModeForWidth(390)).toBe('mobile');
    expect(layoutModeForWidth(0)).toBe('mobile');
  });
});

describe('showsHamburger', () => {
  it('shows below desktop (sidebar is a drawer on tablet + mobile)', () => {
    expect(showsHamburger('mobile')).toBe(true);
    expect(showsHamburger('tablet')).toBe(true);
    expect(showsHamburger('desktop')).toBe(false);
  });
});
