import { configureStore } from '@reduxjs/toolkit';
import appReducer from '@slices/app';
import docsReducer from '@slices/docs';
import playgroundReducer from '@slices/playground';
import themeReducer, { persistThemeMode } from '@slices/theme';

export const createOpenCollectionStore = () => {
  const store = configureStore({
    reducer: {
      app: appReducer,
      docs: docsReducer,
      playground: playgroundReducer,
      theme: themeReducer,
    },
  });

  // Persist theme changes (localStorage + root data-theme) outside the reducer.
  let lastMode = store.getState().theme.mode;
  store.subscribe(() => {
    const mode = store.getState().theme.mode;
    if (mode !== lastMode) {
      lastMode = mode;
      persistThemeMode(mode);
    }
  });

  return store;
};

export type AppStore = ReturnType<typeof createOpenCollectionStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;

