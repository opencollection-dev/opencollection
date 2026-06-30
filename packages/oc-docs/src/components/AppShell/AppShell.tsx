import React, { useCallback, useEffect, useState } from 'react';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Folder } from '@opencollection/types/collection/item';
import Topbar from '../Topbar/Topbar';
import Sidebar from '../Docs/Sidebar/Sidebar';
import PageRouter from '../PageRouter/PageRouter';
import PlaygroundDrawer from '../PlaygroundDrawer/PlaygroundDrawer';
import { useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import { selectPlaygroundCollection } from '../../store/slices/playground';
import { selectGitCollectionUrl } from '../../store/slices/app';
import { useActiveResolution } from '../../routing/hooks';
import { buildBrunoDeepLink } from '../../utils/buildBrunoDeepLink';
import { StyledWrapper } from './StyledWrapper';

interface AppShellProps {
  logo?: React.ReactNode;
  testId?: string;
}

const AppShell: React.FC<AppShellProps> = ({ logo, testId = 'app-shell' }) => {
  const collection = useAppSelector(selectDocsCollection);
  const playgroundCollection = useAppSelector(selectPlaygroundCollection);
  const gitCollectionUrl = useAppSelector(selectGitCollectionUrl);
  const resolution = useActiveResolution();

  const [showDrawer, setShowDrawer] = useState(false);
  const [playgroundItem, setPlaygroundItem] = useState<HttpRequest | Folder | null>(null);

  const activeItem = resolution?.entry.item ?? null;
  const activeType = resolution?.entry.type;
  useEffect(() => {
    if (activeItem && (activeType === 'request' || activeType === 'folder')) {
      setPlaygroundItem(activeItem as HttpRequest | Folder);
    }
  }, [activeItem, activeType]);

  const handleOpenPlayground = useCallback(() => setShowDrawer(true), []);

  return (
    <StyledWrapper className="appshell" data-testid={testId}>
      <Topbar
        collectionName={collection?.info?.name || 'API Collection'}
        version={collection?.info?.version}
        logo={logo}
        openInBrunoHref={buildBrunoDeepLink(gitCollectionUrl)}
      />

      <div className="appshell-row">
        <aside className="appshell-sidebar">
          <Sidebar />
        </aside>
        <main className="appshell-content">
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
    </StyledWrapper>
  );
};

export default AppShell;
