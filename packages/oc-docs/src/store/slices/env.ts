import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@store/store';

/**
 * Which environment the docs are viewing (`activeEnvName`) and whether resolved
 * values are shown (`showVars`, off by default so `{{var}}` placeholders show
 * until the reader turns it on). The env switcher sets these; the resolver reads
 * them to display values. (The playground keeps its own environment separately.)
 *
 * Environments are keyed by name. A saved name that no longer exists in the
 * collection is treated as "none", and the switcher falls back to the first one.
 */
export interface EnvState {
  activeEnvName: string | null;
  showVars: boolean;
}

export const ENV_STORAGE_KEY = 'oc-docs.env';

const defaultState: EnvState = {
  activeEnvName: null,
  showVars: false
};

/**
 * Read the persisted selection from sessionStorage (per-tab, survives reload).
 * Falls back to defaults when nothing is stored or storage is unavailable
 * (standalone build edge cases, node tests).
 */
export const readPersistedEnv = (): EnvState => {
  try {
    const raw = sessionStorage.getItem(ENV_STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<EnvState>;
    return {
      activeEnvName: typeof parsed.activeEnvName === 'string' ? parsed.activeEnvName : null,
      showVars: parsed.showVars === true
    };
  } catch {
    return defaultState;
  }
};

/**
 * Side effect: mirror the selection to sessionStorage. Kept out of the reducers
 * (which stay pure); call it from the store subscription (see store.ts).
 */
export const persistEnv = (state: EnvState) => {
  try {
    sessionStorage.setItem(ENV_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
};

const initialState: EnvState = readPersistedEnv();

const envSlice = createSlice({
  name: 'env',
  initialState,
  reducers: {
    setActiveEnv(state, action: PayloadAction<string | null>) {
      state.activeEnvName = action.payload;
    },
    setShowVars(state, action: PayloadAction<boolean>) {
      state.showVars = action.payload;
    },
    toggleShowVars(state) {
      state.showVars = !state.showVars;
    }
  }
});

export const { setActiveEnv, setShowVars, toggleShowVars } = envSlice.actions;

export const selectActiveEnvName = (state: RootState): string | null => state.env.activeEnvName;
export const selectShowVars = (state: RootState): boolean => state.env.showVars;

export default envSlice.reducer;
