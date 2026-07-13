import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@store/store';

export type CollectionStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AppState {
  collectionStatus: CollectionStatus;
  collectionError: string | null;
  gitCollectionUrl: string | null;
}

const initialState: AppState = {
  collectionStatus: 'idle',
  collectionError: null,
  gitCollectionUrl: null
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCollectionLoading: (state: AppState) => {
      state.collectionStatus = 'loading';
      state.collectionError = null;
    },
    setCollectionSucceeded: (state: AppState) => {
      state.collectionStatus = 'succeeded';
      state.collectionError = null;
    },
    setCollectionFailed: (state: AppState, action: PayloadAction<string>) => {
      state.collectionStatus = 'failed';
      state.collectionError = action.payload;
    },
    resetCollectionState: (state: AppState) => {
      state.collectionStatus = 'idle';
      state.collectionError = null;
    },
    setGitCollectionUrl: (state: AppState, action: PayloadAction<string | null>) => {
      state.gitCollectionUrl = action.payload;
    }
  }
});

export const {
  setCollectionLoading,
  setCollectionSucceeded,
  setCollectionFailed,
  resetCollectionState,
  setGitCollectionUrl
} = appSlice.actions;
export default appSlice.reducer;

export const selectCollectionStatus = (state: RootState) => state.app.collectionStatus;
export const selectCollectionError = (state: RootState) => state.app.collectionError;
export const selectGitCollectionUrl = (state: RootState) => state.app.gitCollectionUrl;


