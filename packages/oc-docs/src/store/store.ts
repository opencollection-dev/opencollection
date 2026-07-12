import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@slices/app';
import docsReducer from '@slices/docs';
import docsExamplesReducer from '@slices/docsExamples';
import envReducer, { persistEnv } from '@slices/env';
import playgroundReducer from '@slices/playground';
import themeReducer, { persistThemeMode } from '@slices/theme';

export const createOpenCollectionStore = () => {
  const store = configureStore({
    reducer: {
      app: appReducer,
      docs: docsReducer,
      docsExamples: docsExamplesReducer,
      env: envReducer,
      playground: playgroundReducer,
      theme: themeReducer,
    },
  });

  // Persist theme changes (localStorage + root data-theme) outside the reducer.
  let lastMode = store.getState().theme.mode;
  // Persist the environment selection (sessionStorage) outside the reducer.
  let lastEnv = store.getState().env;
  store.subscribe(() => {
    const state = store.getState();
    const mode = state.theme.mode;
    if (mode !== lastMode) {
      lastMode = mode;
      persistThemeMode(mode);
    }
    if (state.env !== lastEnv) {
      lastEnv = state.env;
      persistEnv(state.env);
    }
  });

  return store;
};

export type AppStore = ReturnType<typeof createOpenCollectionStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;

