/**
 * AppShell — the three-region layout for page-based navigation (BRU-3188):
 *   - Topbar (sticky, top)        — stub now, BRU-3572 replaces the body
 *   - Sidebar (left)              — existing nav, rewired to routing (BRU-3574 owns styling)
 *   - Content (right, router outlet) — one active page at a time via PageRouter
 *
 * The playground drawer overlays the shell and is driven by the active route.
 */

import React, { useCallback, useEffect, useState } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Folder } from '@opencollection/types/collection/item';
import Topbar from './Topbar/Topbar';
import Sidebar from '../Docs/Sidebar/Sidebar';
import PageRouter from '../pages/PageRouter';
import PlaygroundDrawer from '../PlaygroundDrawer/PlaygroundDrawer';
import { useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import { selectPlaygroundCollection } from '../../store/slices/playground';
import { selectGitCollectionUrl } from '../../store/slices/app';
import { useActiveResolution } from '../../routing/hooks';

interface AppShellProps {
  logo?: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ logo }) => {
  const collection = useAppSelector(selectDocsCollection);
  const playgroundCollection = useAppSelector(selectPlaygroundCollection);
  const gitCollectionUrl = useAppSelector(selectGitCollectionUrl);
  const resolution = useActiveResolution();

  const [showDrawer, setShowDrawer] = useState(false);
  const [playgroundItem, setPlaygroundItem] = useState<HttpRequest | Folder | null>(null);

  // Drive the playground item from the active route (request/folder pages).
  const activeItem = resolution?.entry.item ?? null;
  const activeType = resolution?.entry.type;
  useEffect(() => {
    if (activeItem && (activeType === 'request' || activeType === 'folder')) {
      setPlaygroundItem(activeItem as HttpRequest | Folder);
    }
  }, [activeItem, activeType]);

  const handleOpenPlayground = useCallback(() => setShowDrawer(true), []);
  const handleOpenInBruno = useCallback(() => {
    if (!gitCollectionUrl) return;
    window.open(
      `bruno://app/collection/import/git?url=${encodeURIComponent(gitCollectionUrl)}`,
      '_blank'
    );
  }, [gitCollectionUrl]);

  return (
    <div className="oc-appshell flex flex-col h-screen">
      <Topbar
        collectionName={collection?.info?.name || 'API Collection'}
        version={collection?.info?.version}
        logo={logo}
        onOpenInBruno={gitCollectionUrl ? handleOpenInBruno : undefined}
      />

      <div className="flex flex-1 min-h-0">
        <aside
          className="oc-sidebar h-full overflow-hidden flex-shrink-0 hidden md:flex"
          style={{
            width: 'var(--sidebar-width)',
            borderRight: '1px solid var(--oc-border-border1, var(--border-color))',
            backgroundColor: 'var(--oc-sidebar-bg)',
          }}
        >
          <Sidebar />
        </aside>

        <main className="oc-content flex-1 min-w-0 h-full overflow-y-auto">
          <PageRouter onOpenPlayground={handleOpenPlayground} />
        </main>
      </div>

      <PlaygroundDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        collection={playgroundCollection}
        selectedItem={playgroundItem}
        onSelectItem={setPlaygroundItem}
      />
    </div>
  );
};

export default AppShell;
