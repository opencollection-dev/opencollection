import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { RootState } from '../store';
import { hydrateWithUUIDs, findAndUpdateItem } from '../../utils/items';

export type ViewMode = 'playground' | 'environments' | 'folder-settings' | 'collection-settings';

export interface PlaygroundState {
  collection: OpenCollectionCollection | null;
  hydratedCollection: OpenCollectionCollection | null;
  responses: Record<string, any>; // Store responses by item UUID
  // UI State
  height: number;
  isCollapsed: boolean;
  isDragging: boolean;
  lastExpandedHeight: number;
  viewMode: ViewMode;
  selectedItemId: string | null;
  selectedEnvironment: string;
}

const getDefaultHeight = () => (typeof window !== 'undefined' ? window.innerHeight * 0.9 : 600);

const initialState: PlaygroundState = {
  collection: null,
  hydratedCollection: null,
  responses: {},
  // UI State
  height: 0,
  isCollapsed: false,
  isDragging: false,
  lastExpandedHeight: getDefaultHeight(),
  viewMode: 'playground',
  selectedItemId: null,
  selectedEnvironment: ''
};

const findAndUpdateItemInCollection = (
  items: OpenCollectionItem[] | undefined,
  uuid: string,
  updatedItem: HttpRequest
): boolean => {
  if (!items) return false;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemUuid = (item as any).uuid;
    
    if (itemUuid === uuid) {
      // Preserve UUID when updating
      items[i] = { ...updatedItem, uuid: itemUuid } as any;
      return true;
    }
    
    if ('type' in item && item.type === 'folder') {
      const folder = item as Folder;
      if (folder.items && findAndUpdateItemInCollection(folder.items, uuid, updatedItem)) {
        return true;
      }
    }
  }
  
  return false;
};

const initializeCollapsedState = (items: OpenCollectionItem[] | undefined): void => {
  if (!items) return;
  
  for (const item of items) {
    if ('type' in item && item.type === 'folder') {
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

const preserveCollapsedState = (
  newItems: OpenCollectionItem[],
  oldItems: OpenCollectionItem[]
): void => {
  for (const newItem of newItems) {
    const newUuid = (newItem as any).uuid;
    
    const oldItem = oldItems.find((old: any) => old.uuid === newUuid);
    
    if ('type' in newItem && newItem.type === 'folder') {
      if (oldItem && 'type' in oldItem && oldItem.type === 'folder') {
        (newItem as any).isCollapsed = (oldItem as any).isCollapsed;
        
        const newFolder = newItem as Folder;
        const oldFolder = oldItem as Folder;
        if (newFolder.items && oldFolder.items) {
          preserveCollapsedState(newFolder.items, oldFolder.items);
        }
      } else {
        if ((newItem as any).isCollapsed === undefined) {
          (newItem as any).isCollapsed = true;
        }
      }
    }
  }
};

const playgroundSlice = createSlice({
  name: 'playground',
  initialState,
  reducers: {
    setPlaygroundCollection: (state: PlaygroundState, action: PayloadAction<OpenCollectionCollection | null>) => {
      state.collection = action.payload;
      
      if (!action.payload) {
        state.hydratedCollection = null;
        return;
      }
      
      const hydrated = hydrateWithUUIDs(action.payload);
      
      // Preserve existing collapsed states from previous hydrated collection
      if (state.hydratedCollection?.items && hydrated.items) {
        preserveCollapsedState(hydrated.items, state.hydratedCollection.items);
      } else if (hydrated.items) {
        initializeCollapsedState(hydrated.items);
      }
      
      state.hydratedCollection = hydrated;
    },
    clearPlaygroundCollection: (state: PlaygroundState) => {
      state.collection = null;
      state.hydratedCollection = null;
      state.responses = {};
      state.selectedItemId = null;
    },
    updatePlaygroundItem: (state: PlaygroundState, action: PayloadAction<{ uuid: string; item: HttpRequest }>) => {
      if (!state.collection || !state.collection.items) return;
      
      const { uuid, item } = action.payload;
      findAndUpdateItemInCollection(state.collection.items, uuid, item);
    },
    setPlaygroundResponse: (state: PlaygroundState, action: PayloadAction<{ uuid: string; response: any }>) => {
      const { uuid, response } = action.payload;
      state.responses[uuid] = response;
    },
    clearPlaygroundResponse: (state: PlaygroundState, action: PayloadAction<string>) => {
      const uuid = action.payload;
      delete state.responses[uuid];
    },
    // UI State Actions
    setDrawerHeight: (state: PlaygroundState, action: PayloadAction<number>) => {
      state.height = action.payload;
    },
    setDrawerCollapsed: (state: PlaygroundState, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
    },
    setDrawerDragging: (state: PlaygroundState, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
    setLastExpandedHeight: (state: PlaygroundState, action: PayloadAction<number>) => {
      state.lastExpandedHeight = action.payload;
    },
    setViewMode: (state: PlaygroundState, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setSelectedItemId: (state: PlaygroundState, action: PayloadAction<string | null>) => {
      state.selectedItemId = action.payload;
    },
    setSelectedEnvironment: (state: PlaygroundState, action: PayloadAction<string>) => {
      state.selectedEnvironment = action.payload;
    },
    // Collection Mutation Actions
    toggleFolderCollapse: (state: PlaygroundState, action: PayloadAction<string>) => {
      if (!state.hydratedCollection?.items) return;
      
      const uuid = action.payload;
      findAndUpdateItem(state.hydratedCollection.items, uuid, (item) => {
        const currentCollapsed = (item as any).isCollapsed ?? true;
        (item as any).isCollapsed = !currentCollapsed;
      });
    },
    updateCollectionSettings: (state: PlaygroundState, action: PayloadAction<OpenCollectionCollection>) => {
      state.collection = action.payload;
      state.hydratedCollection = action.payload;
    },
    updateCollectionEnvironments: (state: PlaygroundState, action: PayloadAction<OpenCollectionCollection>) => {
      state.collection = action.payload;
      state.hydratedCollection = action.payload;
    },
    updateFolderInCollection: (state: PlaygroundState, action: PayloadAction<{ uuid: string; folder: Folder }>) => {
      if (!state.hydratedCollection?.items) return;
      
      const { uuid, folder } = action.payload;
      findAndUpdateItem(state.hydratedCollection.items, uuid, (item) => {
        Object.assign(item, folder);
      });
      
      // Also update the base collection
      if (state.collection?.items) {
        findAndUpdateItem(state.collection.items, uuid, (item) => {
          Object.assign(item, folder);
        });
      }
    },
  }
});

export const {
  setPlaygroundCollection,
  clearPlaygroundCollection,
  updatePlaygroundItem,
  setPlaygroundResponse,
  clearPlaygroundResponse,
  setDrawerHeight,
  setDrawerCollapsed,
  setDrawerDragging,
  setLastExpandedHeight,
  setViewMode,
  setSelectedItemId,
  setSelectedEnvironment,
  toggleFolderCollapse,
  updateCollectionSettings,
  updateCollectionEnvironments,
  updateFolderInCollection
} = playgroundSlice.actions;

// Selectors
export const selectPlaygroundCollection = (state: RootState) => state.playground.collection;
export const selectHydratedCollection = (state: RootState) => state.playground.hydratedCollection;
export const selectPlaygroundResponse = (state: RootState, uuid: string) => state.playground.responses[uuid];
export const selectPlaygroundResponses = (state: RootState) => state.playground.responses;
export const selectDrawerHeight = (state: RootState) => state.playground.height;
export const selectDrawerCollapsed = (state: RootState) => state.playground.isCollapsed;
export const selectDrawerDragging = (state: RootState) => state.playground.isDragging;
export const selectLastExpandedHeight = (state: RootState) => state.playground.lastExpandedHeight;
export const selectViewMode = (state: RootState) => state.playground.viewMode;
export const selectSelectedItemId = (state: RootState) => state.playground.selectedItemId;
export const selectSelectedEnvironment = (state: RootState) => state.playground.selectedEnvironment;

export default playgroundSlice.reducer;
