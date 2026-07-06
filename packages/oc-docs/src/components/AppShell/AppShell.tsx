import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Folder } from '@opencollection/types/collection/item';
import Topbar from '../Topbar/Topbar';
import Sidebar from '../Docs/Sidebar/Sidebar';
import SidebarDrawer from '../SidebarDrawer/SidebarDrawer';
import IconButton from '../../ui/IconButton/IconButton';
import { ChevronLeftIcon, ChevronRightIcon } from '../../assets/icons';
import PageRouter from '../PageRouter/PageRouter';
import PlaygroundDrawer from '../PlaygroundDrawer/PlaygroundDrawer';
import SearchBar from '../Search/SearchBar/SearchBar';
import EnvironmentSwitcher from '../EnvironmentSwitcher/EnvironmentSwitcher';
import { useSearchHotkey } from '../../hooks';
import { useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import { selectPlaygroundCollection } from '../../store/slices/playground';
import { selectGitCollectionUrl } from '../../store/slices/app';
import { useActiveResolution } from '../../routing/hooks';
import { useTopbarLayout } from '../../hooks/useTopbarLayout';
import { buildFetchInBrunoUrl } from '../../utils/buildFetchInBrunoUrl';
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

  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [playgroundItem, setPlaygroundItem] = useState<HttpRequest | Folder | null>(null);

  // Single source of truth for search-open, shared by the Topbar (icon + row)
  // and the SearchBar panel so they never disagree (no header growth, no
  // two-state redundancy). ⌘K / Ctrl+K is mounted here so it works regardless
  // of the Topbar's responsive layout (the SearchBar only mounts once open
  // below desktop).
  const [searchOpen, setSearchOpen] = useState(false);
  // Bumped on every hotkey press so the field refocuses even when the panel is
  // already open (open state alone wouldn't change, so it can't drive focus).
  const [searchFocusNonce, setSearchFocusNonce] = useState(0);
  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setSearchFocusNonce((n) => n + 1);
  }, []);
  useSearchHotkey(openSearch);

  const mode = useTopbarLayout();
  const isDesktop = mode === 'desktop';
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Close the mobile drawer when moving to desktop, so it doesn't reappear on
  // its own if the viewport shrinks back to mobile.
  useEffect(() => {
    if (isDesktop) setDrawerOpen(false);
  }, [isDesktop]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const toggleSidebar = useCallback(() => {
    if (mode === 'desktop') setSidebarCollapsed((collapsed) => !collapsed);
    else setDrawerOpen((open) => !open);
  }, [mode]);

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
        searchSlot={<SearchBar open={searchOpen} onOpenChange={setSearchOpen} focusNonce={searchFocusNonce} />}
        searchOpen={searchOpen}
        onSearchOpenChange={setSearchOpen}
        envSwitcherSlot={<EnvironmentSwitcher />}
        onToggleSidebar={toggleSidebar}
        openInBrunoHref={buildFetchInBrunoUrl(gitCollectionUrl)}
      />

      <div className="appshell-row">
        {isDesktop && !sidebarCollapsed && (
          <>
            <aside className="appshell-sidebar" data-testid="app-sidebar">
              <Sidebar />
            </aside>
            <IconButton
              className="appshell-collapse"
              label="Collapse sidebar"
              title="Collapse sidebar"
              data-testid="sidebar-collapse"
              onClick={() => setSidebarCollapsed(true)}
            >
              <ChevronLeftIcon />
            </IconButton>
          </>
        )}
        {isDesktop && sidebarCollapsed && (
          <IconButton
            className="appshell-reopen"
            label="Expand sidebar"
            title="Expand sidebar"
            data-testid="sidebar-expand"
            onClick={() => setSidebarCollapsed(false)}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
        <main className="appshell-content">
          <PageRouter onOpenPlayground={handleOpenPlayground} />
        </main>
      </div>

      {!isDesktop && (
        <SidebarDrawer open={drawerOpen} onClose={closeDrawer}>
          <Sidebar onNavigate={closeDrawer} />
        </SidebarDrawer>
      )}

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
