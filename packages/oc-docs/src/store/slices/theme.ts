import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '../../theme/types';

export const THEME_STORAGE_KEY = 'oc-docs.theme';

const systemPrefersDark = (): boolean => {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  } catch {
    return false;
  }
};

export const readPersistedMode = (): ThemeMode => {
  // An explicit user choice always wins.
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch {
    /* ignore */
  }
  // Nothing persisted yet -> follow the OS preference, default light.
  return systemPrefersDark() ? 'dark' : 'light';
};

/**
 * Side effect: mirror the active mode to localStorage + the root `data-theme`
 * attribute. Kept out of the reducers (which must stay pure) — call this from
 * the store subscription instead (see store.ts).
 */
export const persistThemeMode = (mode: ThemeMode) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', mode);
  }
};

export interface ThemeState {
  mode: ThemeMode;
}

// Seed from the persisted value so the very first render (Monaco theme, toggle
// icon, anything reading s.theme.mode) is already correct — no light->dark flash.
const initialState: ThemeState = { mode: readPersistedMode() };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    }
  }
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
