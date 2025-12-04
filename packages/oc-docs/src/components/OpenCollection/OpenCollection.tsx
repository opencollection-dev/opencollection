import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { OpenCollection as IOpenCollection } from '@opencollection/types';
import PlaygroundDrawer from '../PlaygroundDrawer/PlaygroundDrawer';
import Docs from '../Docs/Docs';
import { parseYaml } from '../../utils/yamlUtils';
import { hydrateWithUUIDs } from '../../utils/items';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectDocsCollection,
  setDocsCollection,
  clearDocsCollection,
  selectItem,
  selectSelectedItemId
} from '@slices/docs';
import {
  selectPlaygroundCollection,
  setPlaygroundCollection,
  clearPlaygroundCollection
} from '@slices/playground';
import {
  selectCollectionStatus,
  selectCollectionError,
  setCollectionLoading,
  setCollectionSucceeded,
  setCollectionFailed,
  resetCollectionState
} from '@slices/app';
import { createOpenCollectionStore, type AppStore } from '../../store/store';

const isFileInstance = (value: unknown): value is File =>
  typeof File !== 'undefined' && value instanceof File;

const parseCollectionContent = (content: string): OpenCollectionCollection => {
  try {
    return parseYaml(content) as OpenCollectionCollection;
  } catch (yamlError) {
    try {
      return JSON.parse(content) as OpenCollectionCollection;
    } catch (jsonError) {
      throw new Error('Failed to parse collection as YAML or JSON');
    }
  }
};

const resolveCollectionSource = async (
  source: OpenCollectionCollection | string | File
): Promise<OpenCollectionCollection> => {
  if (isFileInstance(source)) {
    const text = await source.text();
    return parseCollectionContent(text);
  }

  if (typeof source === 'string') {
    if (source.startsWith('http://') || source.startsWith('https://')) {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to fetch collection: ${response.statusText}`);
      }
      const text = await response.text();
      return parseCollectionContent(text);
    }

    return parseCollectionContent(source);
  }

  return source;
};

interface DesktopLayoutProps {
  docsCollection: OpenCollectionCollection | null;
  playgroundCollection: OpenCollectionCollection | null;
  filteredCollectionItems: OpenCollectionItem[];
  children?: React.ReactNode;
}

const findItemByUuid = (items: OpenCollectionItem[] | undefined, uuid: string): OpenCollectionItem | null => {
  if (!items) return null;
  
  for (const item of items) {
    const itemUuid = (item as any).uuid;
    if (itemUuid === uuid) {
      return item;
    }
    if ('type' in item && item.type === 'folder' && (item as Folder).items) {
      const found = findItemByUuid((item as Folder).items, uuid);
      if (found) return found;
    }
  }
  return null;
};

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  docsCollection,
  playgroundCollection,
  filteredCollectionItems
}) => {
  const selectedItemId = useAppSelector(selectSelectedItemId);
  const [playgroundItem, setPlaygroundItem] = useState<HttpRequest | Folder | null>(null);
  const [showPlaygroundDrawer, setShowPlaygroundDrawer] = useState(false);
  const prevSelectedItemIdRef = useRef(selectedItemId);
  const playgroundItemUuidRef = useRef<string | undefined>(undefined);
  const dispatch = useAppDispatch();

  useEffect(() => {
    playgroundItemUuidRef.current = (playgroundItem as any)?.uuid;
  }, [playgroundItem]);

  // Update playground item when selected item changes (but don't open drawer)
  useEffect(() => {
    const selectionChanged = prevSelectedItemIdRef.current !== selectedItemId;
    prevSelectedItemIdRef.current = selectedItemId;

    if (selectedItemId && playgroundCollection) {
      if (!selectionChanged && playgroundItemUuidRef.current && playgroundItemUuidRef.current !== selectedItemId) {
        return;
      }

      const item = findItemByUuid(playgroundCollection.items, selectedItemId);
      if (item && (item.type === 'http' || item.type === 'folder')) {
        setPlaygroundItem(item as HttpRequest | Folder);
        // Don't open drawer automatically - only open when "Try" is clicked
      }
    }
  }, [selectedItemId, playgroundCollection]);

  const handlePlaygroundItemSelect = useCallback((item: HttpRequest | Folder) => {
    // Only update the playground item, don't affect the docs view
    setPlaygroundItem(item);
  }, []);

  const handleOpenPlayground = useCallback(() => {
    setShowPlaygroundDrawer(true);
  }, []);

  return (
    <div className="flex h-screen">
      <Docs
        docsCollection={docsCollection}
        filteredCollectionItems={filteredCollectionItems}
        onOpenPlayground={handleOpenPlayground}
      />

      <PlaygroundDrawer
        isOpen={showPlaygroundDrawer}
        onClose={() => setShowPlaygroundDrawer(false)}
        collection={playgroundCollection}
        selectedItem={playgroundItem}
        onSelectItem={handlePlaygroundItemSelect}
      />
    </div>
  );
};

/**
 * OpenCollection React component props
 */
export interface OpenCollectionProps {
  collection: IOpenCollection | string | File;
  logo?: React.ReactNode;
}

const OpenCollectionContent: React.FC<OpenCollectionProps> = ({
  collection,
}) => {
  const dispatch = useAppDispatch();
  const docsCollection = useAppSelector(selectDocsCollection);
  const playgroundCollection = useAppSelector(selectPlaygroundCollection);
  const collectionStatus = useAppSelector(selectCollectionStatus);
  const collectionError = useAppSelector(selectCollectionError);
  const selectedItemId = useAppSelector((state) => state.docs.selectedItemId);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      dispatch(setCollectionLoading());

      try {
        const resolved = await resolveCollectionSource(collection);
        if (!isActive) {
          return;
        }
        // Hydrate collection with UUIDs before saving to Redux
        const hydrated = hydrateWithUUIDs(resolved);
        
        dispatch(setDocsCollection(hydrated));
        dispatch(setPlaygroundCollection(hydrated));
        dispatch(setCollectionSucceeded());
      } catch (err) {
        if (!isActive) {
          return;
        }
        const message = err instanceof Error ? err.message : 'Failed to load API collection';
        dispatch(setCollectionFailed(message));
        dispatch(clearDocsCollection());
        dispatch(clearPlaygroundCollection());
      }
    };

    if (collection == null) {
      dispatch(clearDocsCollection());
      dispatch(clearPlaygroundCollection());
      dispatch(resetCollectionState());
      return () => {
        isActive = false;
      };
    }

    if (isFileInstance(collection) || typeof collection === 'string') {
      void load();
    } else {
      const hydrated = hydrateWithUUIDs(collection as OpenCollectionCollection);
      dispatch(setDocsCollection(hydrated));
      dispatch(setPlaygroundCollection(hydrated));
      dispatch(setCollectionSucceeded());
    }

    return () => {
      isActive = false;
    };
  }, [collection, dispatch]);

  const filteredCollectionItems: OpenCollectionItem[] = docsCollection?.items || [];

  const isInitialLoad =
    collectionStatus === 'idle' && !docsCollection && !playgroundCollection;
  const isLoading = collectionStatus === 'loading' || isInitialLoad;
  const error = collectionError;

  // Set initial page to first root-level request when collection loads
  useEffect(() => {
    if (docsCollection && selectedItemId === null) {
      const items = docsCollection.items;

      const firstRequest = items?.find((item) => item.type === 'http');
      if (firstRequest && (firstRequest as any).uuid) {
        dispatch(selectItem((firstRequest as any).uuid));
      } else if (items && items.length > 0) {
        const firstItem = items[0];
        if (firstItem && (firstItem as any).uuid) {
          dispatch(selectItem((firstItem as any).uuid));
        }
      }
    }
  }, [docsCollection, selectedItemId, dispatch]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  }

  const desktopProps = {
    docsCollection,
    playgroundCollection,
    filteredCollectionItems,
  };

  return (
    <div className="oc-playground">
      <DesktopLayout {...desktopProps} />
    </div>
  );
};

const OpenCollection: React.FC<OpenCollectionProps> = (props) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createOpenCollectionStore();
  }

  return (
    <Provider store={storeRef.current!}>
      <OpenCollectionContent {...props} />
    </Provider>
  );
};

export default OpenCollection;