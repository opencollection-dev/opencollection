import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Folder } from '@opencollection/types/collection/item';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  selectHydratedCollection,
  selectViewMode,
  selectSelectedItemId,
  setViewMode,
  setSelectedItemId,
  toggleFolderCollapse,
} from '@slices/playground';
import { selectActiveEnvName } from '../../../store/slices/env';
import { useNavModel } from '../../../routing/hooks';
import { usePlaygroundUrlState, useElementWidth } from '../../../hooks';
import { getItemUuid, findItemByUuid } from '../../../utils/itemUtils';
import { isFolder } from '../../../utils/schemaHelpers';
import PlaygroundView from '../Content/Views/PlaygroundView/PlaygroundView';
import FolderSettingsView from '../Content/Views/FolderSettingsView/FolderSettingsView';
import EnvironmentsView from '../Content/Views/EnvironmentsView/EnvironmentsView';
import CollectionSettingsView from '../Content/Views/CollectionSettingsView/CollectionSettingsView';
import PlaygroundSidebar from '../PlaygroundSidebar/PlaygroundSidebar';
import type { DockMode } from '../../../utils/playgroundDock';
import { StyledWrapper } from './StyledWrapper';

const ORIENTATION_BREAKPOINT = 640;

interface PlaygroundBodyProps {
  requestSlug: string | null;
  sidebarOpen: boolean;
  dock: DockMode;
  onCloseSidebar: () => void;
  // Tracks the applied request slug across dock-switch remounts; owned by
  // Playground so it survives a dock switch but resets on close (see there).
  appliedSlugRef: React.MutableRefObject<string | null>;
}

const PlaygroundBody: React.FC<PlaygroundBodyProps> = ({
  requestSlug,
  sidebarOpen,
  dock,
  onCloseSidebar,
  appliedSlugRef,
}) => {
  const dispatch = useAppDispatch();
  const model = useNavModel();
  const { setRequestSlug } = usePlaygroundUrlState();
  const collection = useAppSelector(selectHydratedCollection);
  const viewMode = useAppSelector(selectViewMode);
  const selectedItemId = useAppSelector(selectSelectedItemId);
  const activeEnvName = useAppSelector(selectActiveEnvName);

  const uuidToSlug = useMemo<Map<string, string>>(() => {
    const map = new Map<string, string>();
    for (const entry of model.ordered) {
      const uuid = getItemUuid(entry.item);
      if (uuid) map.set(uuid, entry.slug);
    }
    return map;
  }, [model]);

  const selectedItem = useMemo(
    () => findItemByUuid(collection?.items, selectedItemId),
    [collection, selectedItemId]
  );
  const activeSlug = selectedItemId ? uuidToSlug.get(selectedItemId) ?? '' : '';

  const viewRef = useRef<HTMLDivElement>(null);
  const viewWidth = useElementWidth(viewRef);
  const orientation = viewWidth > 0 && viewWidth < ORIENTATION_BREAKPOINT ? 'vertical' : 'horizontal';

  // Apply the URL's request slug once per value (deep-link / Try). Keyed on the
  // slug, not selectedItemId, so opening the gear or a folder (which clears the
  // selection) is not immediately reverted back to the request.
  useEffect(() => {
    if (!requestSlug || appliedSlugRef.current === requestSlug) return;
    const entry = model.bySlug.get(requestSlug);
    const uuid = entry ? getItemUuid(entry.item) : undefined;
    // Only mark the slug applied once it actually resolves, so a deep-link / Try
    // that arrives before the collection hydrates is retried when the model
    // loads (the effect re-runs on `model`) instead of being dropped.
    if (uuid) {
      appliedSlugRef.current = requestSlug;
      dispatch(setSelectedItemId(uuid));
      dispatch(setViewMode('playground'));
    }
  }, [requestSlug, model, dispatch, appliedSlugRef]);

  // In the inline dock the sidebar is an overlay, so close it once the user has
  // picked something to view (mirrors a mobile navigation drawer).
  const closeSidebarIfInline = useCallback(() => {
    if (dock === 'inline') onCloseSidebar();
  }, [dock, onCloseSidebar]);

  const handleNavigate = useCallback(
    (slug: string) => {
      const entry = model.bySlug.get(slug);
      if (!entry) return;
      const uuid = getItemUuid(entry.item);
      if (!uuid) return;
      dispatch(setSelectedItemId(uuid));
      if (isFolder(entry.item)) {
        dispatch(setViewMode('folder-settings'));
      } else {
        dispatch(setViewMode('playground'));
        setRequestSlug(slug);
      }
      closeSidebarIfInline();
    },
    [model, dispatch, setRequestSlug, closeSidebarIfInline]
  );

  const handleToggleFolder = useCallback((uuid: string) => dispatch(toggleFolderCollapse(uuid)), [dispatch]);

  const openEnvironments = useCallback(() => {
    dispatch(setViewMode('environments'));
    dispatch(setSelectedItemId(null));
    closeSidebarIfInline();
  }, [dispatch, closeSidebarIfInline]);

  const openCollection = useCallback(() => {
    dispatch(setViewMode('collection-settings'));
    dispatch(setSelectedItemId(null));
    closeSidebarIfInline();
  }, [dispatch, closeSidebarIfInline]);

  const view = (() => {
    if (viewMode === 'collection-settings' && collection) return <CollectionSettingsView collection={collection} />;
    if (viewMode === 'environments' && collection) return <EnvironmentsView collection={collection} />;
    if (viewMode === 'folder-settings' && selectedItem && isFolder(selectedItem) && collection) {
      return (
        <FolderSettingsView folder={selectedItem as Folder} collection={collection} onFolderChange={() => undefined} />
      );
    }
    if (viewMode === 'playground' && selectedItem && !isFolder(selectedItem) && collection) {
      return (
        <PlaygroundView
          item={selectedItem as HttpRequest}
          collection={collection}
          selectedEnvironment={activeEnvName ?? ''}
          orientation={orientation}
        />
      );
    }
    return <div className="prompt">Select an endpoint from the sidebar to get started.</div>;
  })();

  return (
    <StyledWrapper data-testid="playground-runner" data-overlay-sidebar={dock === 'inline' ? 'true' : undefined}>
      {sidebarOpen && (
        <aside className="sidebar" data-testid="playground-sidebar-panel">
          <PlaygroundSidebar
            collection={collection}
            activeSlug={activeSlug}
            uuidToSlug={uuidToSlug}
            onNavigate={handleNavigate}
            onToggleFolder={handleToggleFolder}
            onOpenEnvironments={openEnvironments}
            environmentsActive={viewMode === 'environments'}
            onOpenCollection={openCollection}
            collectionActive={viewMode === 'collection-settings'}
          />
        </aside>
      )}
      <div className="view" data-testid="playground-view" ref={viewRef}>
        {view}
      </div>
    </StyledWrapper>
  );
};

export default PlaygroundBody;