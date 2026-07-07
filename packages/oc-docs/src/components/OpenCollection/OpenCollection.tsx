import React, { useRef, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { OpenCollection as IOpenCollection } from '@opencollection/types';
import AppShell from '../AppShell/AppShell';
import { parseYaml } from '../../utils/yamlUtils';
import { hydrateWithUUIDs } from '../../utils/fileUtils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectDocsCollection,
  setDocsCollection,
  clearDocsCollection,
} from '@slices/docs';
import {
  setPlaygroundCollection,
  clearPlaygroundCollection,
} from '@slices/playground';
import {
  selectCollectionStatus,
  selectCollectionError,
  setCollectionLoading,
  setCollectionSucceeded,
  setCollectionFailed,
  resetCollectionState,
  setGitCollectionUrl
} from '@slices/app';
import { createOpenCollectionStore, type AppStore } from '../../store/store';
import { VariableResolverProvider } from '../../hooks';
import { applyTheme } from '../../theme/applyTheme';

// Set data-theme on the root element before the component first paints to avoid a flash.
applyTheme();

const isFileInstance = (value: unknown): value is File =>
  typeof File !== 'undefined' && value instanceof File;

const parseCollectionContent = (content: string): OpenCollectionCollection => {
  try {
    return parseYaml(content) as OpenCollectionCollection;
  } catch {
    try {
      return JSON.parse(content) as OpenCollectionCollection;
    } catch {
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

export interface OpenCollectionProps {
  collection: IOpenCollection | string | File;
  logo?: React.ReactNode;
  gitCollectionUrl?: string;
}

const OpenCollectionContent: React.FC<OpenCollectionProps> = ({
  collection,
  logo,
  gitCollectionUrl,
}) => {
  const dispatch = useAppDispatch();
  const docsCollection = useAppSelector(selectDocsCollection);
  const collectionStatus = useAppSelector(selectCollectionStatus);
  const collectionError = useAppSelector(selectCollectionError);

  useEffect(() => {
    gitCollectionUrl && dispatch(setGitCollectionUrl(gitCollectionUrl));
  }, [gitCollectionUrl, dispatch]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      dispatch(setCollectionLoading());

      try {
        const resolved = await resolveCollectionSource(collection);
        if (!isActive) return;
        const hydrated = hydrateWithUUIDs(resolved);
        dispatch(setDocsCollection(hydrated));
        dispatch(setPlaygroundCollection(hydrated));
        dispatch(setCollectionSucceeded());
      } catch (err) {
        if (!isActive) return;
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
      return () => { isActive = false; };
    }

    if (isFileInstance(collection) || typeof collection === 'string') {
      void load();
    } else {
      const hydrated = hydrateWithUUIDs(collection as OpenCollectionCollection);
      dispatch(setDocsCollection(hydrated));
      dispatch(setPlaygroundCollection(hydrated));
      dispatch(setCollectionSucceeded());
    }

    return () => { isActive = false; };
  }, [collection, dispatch]);

  const isInitialLoad = collectionStatus === 'idle' && !docsCollection;
  const isLoading = collectionStatus === 'loading' || isInitialLoad;

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (collectionError) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {collectionError}</div>;
  }

  return (
    <div className="oc-playground">
      <AppShell logo={logo} />
    </div>
  );
};

const OpenCollection: React.FC<OpenCollectionProps> = (props) => {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createOpenCollectionStore();
  }

  return (
    <HashRouter>
      <Provider store={storeRef.current!}>
        <VariableResolverProvider>
          <OpenCollectionContent {...props} />
        </VariableResolverProvider>
      </Provider>
    </HashRouter>
  );
};

export default OpenCollection;
