import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash-es';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { Environment } from '@opencollection/types/config/environments';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { RootState } from '../store';
import { hydrateWithUUIDs, findAndUpdateItem } from '../../utils/fileUtils';
import { isFolder } from '../../utils/schemaHelpers';

export type ViewMode = 'playground' | 'environments' | 'folder-settings' | 'collection-settings' | 'example';

export interface PlaygroundState {
  collection: OpenCollectionCollection | null;
  hydratedCollection: OpenCollectionCollection | null;
  pristineEnvironments: Environment[] | null;
  responses: Record<string, any>; // Store responses by item UUID
  // UI State
  viewMode: ViewMode;
  selectedItemId: string | null;
  selectedExampleIndex: number | null;
}

const initialState: PlaygroundState = {
  collection: null,
  hydratedCollection: null,
  pristineEnvironments: null,
  responses: {},
  // UI State
  viewMode: 'playground',
  selectedItemId: null,
  selectedExampleIndex: null,
};

const readEnvironments = (collection: OpenCollectionCollection): Environment[] | null =>
  (collection as any).environments ?? collection.config?.environments ?? null;

const writeEnvironments = (collection: OpenCollectionCollection, environments: Environment[] | null): void => {
  if ((collection as any).environments !== undefined) (collection as any).environments = environments ?? undefined;
  if (collection.config) collection.config.environments = environments ?? undefined;
  else if (environments) collection.config = { environments };
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
    
    if (isFolder(item)) {
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

const preserveCollapsedState = (
  newItems: OpenCollectionItem[],
  oldItems: OpenCollectionItem[]
): void => {
  for (const newItem of newItems) {
    const newUuid = (newItem as any).uuid;
    
    const oldItem = oldItems.find((old: any) => old.uuid === newUuid);
    
    if (isFolder(newItem)) {
      if (oldItem && isFolder(oldItem)) {
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
        state.pristineEnvironments = null;
        return;
      }

      const envs = readEnvironments(action.payload);
      state.pristineEnvironments = envs ? cloneDeep(envs) : null;

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
      state.pristineEnvironments = null;
      state.responses = {};
      state.selectedItemId = null;
      state.selectedExampleIndex = null;
    },
    updatePlaygroundItem: (state: PlaygroundState, action: PayloadAction<{ uuid: string; item: HttpRequest }>) => {
      const { uuid, item } = action.payload;
      if (state.collection?.items) findAndUpdateItemInCollection(state.collection.items, uuid, item);
      if (state.hydratedCollection?.items) findAndUpdateItemInCollection(state.hydratedCollection.items, uuid, item);
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
    setViewMode: (state: PlaygroundState, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setSelectedItemId: (state: PlaygroundState, action: PayloadAction<string | null>) => {
      state.selectedItemId = action.payload;
    },
    setSelectedExampleIndex: (state: PlaygroundState, action: PayloadAction<number | null>) => {
      state.selectedExampleIndex = action.payload;
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
    // Opens the given folders in the sidebar tree so the selected item shows up
    // inside them. Only ever opens, never closes, so a folder the user collapsed
    // by hand stays closed.
    expandFolders: (state: PlaygroundState, action: PayloadAction<string[]>) => {
      if (!state.hydratedCollection?.items || action.payload.length === 0) return;
      const targets = new Set(action.payload);
      for (const uuid of targets) {
        findAndUpdateItem(state.hydratedCollection.items, uuid, (item) => {
          (item as { isCollapsed?: boolean }).isCollapsed = false;
        });
      }
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
    resetPlaygroundEnvironments: (state: PlaygroundState) => {
      const environments = state.pristineEnvironments ? cloneDeep(state.pristineEnvironments) : null;
      if (state.hydratedCollection) writeEnvironments(state.hydratedCollection, environments);
      if (state.collection) writeEnvironments(state.collection, environments);
    },
  }
});

export const {
  setPlaygroundCollection,
  clearPlaygroundCollection,
  updatePlaygroundItem,
  setPlaygroundResponse,
  clearPlaygroundResponse,
  setViewMode,
  setSelectedItemId,
  setSelectedExampleIndex,
  toggleFolderCollapse,
  expandFolders,
  updateCollectionSettings,
  updateCollectionEnvironments,
  updateFolderInCollection,
  resetPlaygroundEnvironments
} = playgroundSlice.actions;

// Selectors
export const selectPlaygroundCollection = (state: RootState) => state.playground.collection;
export const selectHydratedCollection = (state: RootState) => state.playground.hydratedCollection;
export const selectPlaygroundResponse = (state: RootState, uuid: string) => state.playground.responses[uuid];
export const selectPlaygroundResponses = (state: RootState) => state.playground.responses;
export const selectViewMode = (state: RootState) => state.playground.viewMode;
export const selectSelectedItemId = (state: RootState) => state.playground.selectedItemId;
export const selectSelectedExampleIndex = (state: RootState) => state.playground.selectedExampleIndex;

export default playgroundSlice.reducer;
