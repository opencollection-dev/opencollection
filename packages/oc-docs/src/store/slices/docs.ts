import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { RootState } from '@store/store';
import { hydrateWithUUIDs, findAndUpdateItem } from '@utils/fileUtils';
import { isFolder } from '@utils/schemaHelpers';

export interface DocsState {
  collection: OpenCollectionCollection | null;
  selectedItemId: string | null;
}

const initialState: DocsState = {
  collection: null,
  selectedItemId: null
};

// Helper function to initialize isCollapsed for folders
const initializeCollapsedState = (items: OpenCollectionItem[] | undefined): void => {
  if (!items) return;
  
  for (const item of items) {
    if (isFolder(item)) {
      // Initialize isCollapsed to true (collapsed) if not already set
      if ((item as any).isCollapsed === undefined) {
        (item as any).isCollapsed = true;
      }
      const folder = item as Folder;
      if (folder.items) {
        initializeCollapsedState(folder.items);
      }
    }
  }
};

const docsSlice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    setDocsCollection: (state: DocsState, action: PayloadAction<OpenCollectionCollection | null>) => {
      // Hydrate collection with UUIDs if collection is provided
      const collection = action.payload ? hydrateWithUUIDs(action.payload) : null;
      state.collection = collection;
      // Initialize isCollapsed for all folders
      if (state.collection && state.collection.items) {
        initializeCollapsedState(state.collection.items);
      }
      // Reset selected item when collection changes
      state.selectedItemId = null;
    },
    clearDocsCollection: (state: DocsState) => {
      state.collection = null;
      state.selectedItemId = null;
    },
    toggleItem: (state: DocsState, action: PayloadAction<string>) => {
      const uuid = action.payload;
      if (state.collection && state.collection.items) {
        findAndUpdateItem(state.collection.items, uuid, (item) => {
          // Treat undefined as true (collapsed), then toggle
          const currentCollapsed = (item as any).isCollapsed ?? true;
          (item as any).isCollapsed = !currentCollapsed;
        });
      }
    },
    selectItem: (state: DocsState, action: PayloadAction<string | null>) => {
      state.selectedItemId = action.payload;
    },
    // Expand-only: force the given folders open (used to reveal the active
    // item's ancestors on navigation/deep-link). Never collapses, so it does
    // not fight a folder the user manually closed.
    expandFolders: (state: DocsState, action: PayloadAction<string[]>) => {
      if (!state.collection?.items || action.payload.length === 0) return;
      const targets = new Set(action.payload);
      for (const uuid of targets) {
        findAndUpdateItem(state.collection.items, uuid, (item) => {
          (item as { isCollapsed?: boolean }).isCollapsed = false;
        });
      }
    },
  }
});

export const { setDocsCollection, clearDocsCollection, toggleItem, selectItem, expandFolders } = docsSlice.actions;
export default docsSlice.reducer;

export const selectDocsCollection = (state: RootState) => state.docs.collection;
export const selectSelectedItemId = (state: RootState) => state.docs.selectedItemId;


