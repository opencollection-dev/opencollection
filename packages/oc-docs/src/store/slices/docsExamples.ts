import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface ExampleHighlight {
  requestUuid: string;
  index: number;
}

export interface DocsExamplesState {
  highlight: ExampleHighlight | null;
}

const initialState: DocsExamplesState = { highlight: null };

const docsExamplesSlice = createSlice({
  name: 'docsExamples',
  initialState,
  reducers: {
    setExampleHighlight: (state, action: PayloadAction<ExampleHighlight>) => {
      state.highlight = action.payload;
    },
    clearExampleHighlight: (state) => {
      state.highlight = null;
    },
  },
});

export const { setExampleHighlight, clearExampleHighlight } = docsExamplesSlice.actions;
export default docsExamplesSlice.reducer;

export const selectExampleHighlight = (state: RootState): ExampleHighlight | null =>
  state.docsExamples.highlight;
