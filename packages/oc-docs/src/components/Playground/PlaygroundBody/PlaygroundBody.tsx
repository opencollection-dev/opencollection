import React, { useEffect, useMemo, useRef } from 'react';
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

  // Reopen whatever the URL says was last open. `pgReq` holds a request, a
  // folder, or the environments / collection-settings view, so a deep link, a
  // Try, or a reload all bring back the same thing. Runs once per URL value.
  useEffect(() => {
    if (!requestSlug || appliedSlugRef.current === requestSlug) return;
    const target = resolvePlaygroundTarget(requestSlug, model);
    if (!target) return; // sidebar list hasn't loaded this item yet - retry once it does
    // A request or folder needs the playground's own copy of the collection to
    // select it and open its parent folders. On reload that copy can arrive just
    // after the sidebar list, so if it isn't ready we wait instead of marking
    // this done - otherwise the folders would never open. The environments and
    // collection views need no collection, so they open right away.
    if (target.uuid && !collection?.items) return;
    appliedSlugRef.current = requestSlug;
    dispatch(setSelectedItemId(target.uuid));
    dispatch(setViewMode(target.view));
    if (target.expandUuids.length) dispatch(expandFolders(target.expandUuids));
  }, [requestSlug, model, collection, dispatch, appliedSlugRef]);

  // In the inline dock the sidebar is an overlay, so close it once the user has
  // picked something to view (mirrors a mobile navigation drawer).
  const closeSidebarIfInline = () => {
    if (dock === 'inline') onCloseSidebar();
  };

  // Clicking something in the sidebar just writes it to the URL (folders too, so
  // a folder view comes back on reload). The effect above is what actually opens
  // it, so a click and a reload go through the exact same path.
  const handleNavigate = (slug: string) => {
    const entry = model.bySlug.get(slug);
    if (!entry || !getItemUuid(entry.item)) return; // not a real item, ignore the click
    setRequestSlug(slug);
    closeSidebarIfInline();
  };

  const handleToggleFolder = (uuid: string) => dispatch(toggleFolderCollapse(uuid));

  const openEnvironments = () => {
    setRequestSlug(PLAYGROUND_ENVIRONMENTS_SLUG); // effect opens the view; reload brings it back
    closeSidebarIfInline();
  };

  const openCollection = () => {
    setRequestSlug(PLAYGROUND_COLLECTION_SLUG); // effect opens the view; reload brings it back
    closeSidebarIfInline();
  };

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
