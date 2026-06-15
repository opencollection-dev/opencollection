import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import reducer, {
  setTheme,
  toggleTheme,
  readPersistedMode,
  persistThemeMode,
  THEME_STORAGE_KEY,
} from './theme';

beforeAll(() => {
  let store: Record<string, string> = {};
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  });
});

describe('themeSlice', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to light when nothing persisted', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({ mode: 'light' });
  });

  it('setTheme sets the mode (pure, no side effects)', () => {
    expect(reducer({ mode: 'light' }, setTheme('dark')).mode).toBe('dark');
    // reducer must not touch localStorage
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('toggle flips mode', () => {
    expect(reducer({ mode: 'light' }, toggleTheme()).mode).toBe('dark');
    expect(reducer({ mode: 'dark' }, toggleTheme()).mode).toBe('light');
  });

  it('persistThemeMode writes the mode to localStorage', () => {
    persistThemeMode('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('readPersistedMode returns stored value or light', () => {
    expect(readPersistedMode()).toBe('light');
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(readPersistedMode()).toBe('dark');
  });
});
