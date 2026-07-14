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
  expandFolders,
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
import {
  resolvePlaygroundTarget,
  PLAYGROUND_ENVIRONMENTS_SLUG,
  PLAYGROUND_COLLECTION_SLUG,
} from './resolvePlaygroundTarget';
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

  // Apply the URL's pgReq target once per value (deep-link / Try / reload). It
  // carries the request/folder slug OR a ~environments / ~collection token, so
  // the folder, environments and collection-settings views survive a refresh too
  // (not just requests). Keyed on the slug (not selectedItemId), and only marked
  // applied once resolvePlaygroundTarget returns non-null, so an item slug that
  // arrives before the collection hydrates is retried when the model loads.
  useEffect(() => {
    if (!requestSlug || appliedSlugRef.current === requestSlug) return;
    const target = resolvePlaygroundTarget(requestSlug, model);
    if (!target) return; // item not resolvable yet -> retry when `model` updates
    // Item targets select from / expand against the playground's hydrated
    // collection, which is a separate slice from `model`. If it has not landed
    // yet, wait (don't claim) so expandFolders is not dropped and never retried;
    // the ~environments / ~collection tokens (uuid null) need no collection.
    if (target.uuid && !collection?.items) return;
    appliedSlugRef.current = requestSlug;
    dispatch(setSelectedItemId(target.uuid));
    dispatch(setViewMode(target.view));
    if (target.ancestors.length) dispatch(expandFolders(target.ancestors));
  }, [requestSlug, model, collection, dispatch, appliedSlugRef]);

  // In the inline dock the sidebar is an overlay, so close it once the user has
  // picked something to view (mirrors a mobile navigation drawer).
  const closeSidebarIfInline = useCallback(() => {
    if (dock === 'inline') onCloseSidebar();
  }, [dock, onCloseSidebar]);

  // These only record the pgReq slug (folders too, so a folder view survives
  // reload); the apply effect above is the single place that turns a slug into
  // selection + view + folder reveal, so a click and a reload take the same path.
  const handleNavigate = useCallback(
    (slug: string) => {
      const entry = model.bySlug.get(slug);
      if (!entry || !getItemUuid(entry.item)) return; // ignore rows that don't resolve
      setRequestSlug(slug);
      closeSidebarIfInline();
    },
    [model, setRequestSlug, closeSidebarIfInline]
  );

  const handleToggleFolder = useCallback((uuid: string) => dispatch(toggleFolderCollapse(uuid)), [dispatch]);

  const openEnvironments = useCallback(() => {
    setRequestSlug(PLAYGROUND_ENVIRONMENTS_SLUG); // effect applies the view; persists for reload
    closeSidebarIfInline();
  }, [setRequestSlug, closeSidebarIfInline]);

  const openCollection = useCallback(() => {
    setRequestSlug(PLAYGROUND_COLLECTION_SLUG); // effect applies the view; persists for reload
    closeSidebarIfInline();
  }, [setRequestSlug, closeSidebarIfInline]);

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
