import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '../../theme/types';

export const THEME_STORAGE_KEY = 'oc-docs.theme';

export const readPersistedMode = (): ThemeMode => {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const persist = (mode: ThemeMode) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', mode);
  }
};

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = { mode: 'light' };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      persist(state.mode);
    },
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      persist(state.mode);
    }
  }
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
