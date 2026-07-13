import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Topbar from '@components/Topbar/Topbar';
import EnvSwitcher from '@components/EnvSwitcher/EnvSwitcher';
import ShowVarsToggle from '@components/ShowVarsToggle/ShowVarsToggle';
import Sidebar from '@components/Docs/Sidebar/Sidebar';
import SidebarDrawer from '@components/SidebarDrawer/SidebarDrawer';
import IconButton from '@ui/IconButton/IconButton';
import { ChevronLeftIcon, ChevronRightIcon } from '../../assets/icons';
import PageRouter from '@components/PageRouter/PageRouter';
import Playground from '@components/Playground/Playground';
import SearchBar from '@components/Search/SearchBar/SearchBar';
import { useSearchHotkey, usePlaygroundUrlState, useElementWidth } from '@hooks';
import { useAppSelector } from '@store/hooks';
import { selectDocsCollection } from '@slices/docs';
import { selectGitCollectionUrl } from '@slices/app';
import { useActiveResolution } from '../../routing/hooks';
import { layoutModeForWidth } from '@hooks/useTopbarLayout';
import { buildFetchInBrunoUrl } from '@utils/buildFetchInBrunoUrl';
import { StyledWrapper } from './StyledWrapper';

interface AppShellProps {
  logo?: React.ReactNode;
  testId?: string;
}

const AppShell: React.FC<AppShellProps> = ({ logo, testId = 'app-shell' }) => {
  const collection = useAppSelector(selectDocsCollection);
  const gitCollectionUrl = useAppSelector(selectGitCollectionUrl);
  const resolution = useActiveResolution();

  // Single source of truth for search-open, shared by the Topbar (icon + row)
  // and the SearchBar panel so they never disagree. ⌘K / Ctrl+K is mounted here
  // so it works regardless of the Topbar's responsive layout.
  const [searchOpen, setSearchOpen] = useState(false);
  // Bumped on every hotkey press so the field refocuses even when the panel is
  // already open (open state alone wouldn't change, so it can't drive focus).
  const [searchFocusNonce, setSearchFocusNonce] = useState(0);
  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setSearchFocusNonce((n) => n + 1);
  }, []);
  useSearchHotkey(openSearch);

  // Responsive mode follows the docs area width, not the window: when the inline
  // playground takes part of the row, the docs column (`.appshell-body`) shrinks
  // and the docs chrome (topbar + sidebar) should go tablet/mobile accordingly.
  // In the other docks the shell is a column, so this equals the window width.
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyWidth = useElementWidth(bodyRef);
  const mode = layoutModeForWidth(bodyWidth || (typeof window !== 'undefined' ? window.innerWidth : 1024));
  const isDesktop = mode === 'desktop';
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  const { open: playgroundOpen, dock: playgroundDock, openPlayground } = usePlaygroundUrlState();

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

  const handleOpenPlayground = useCallback(() => {
    openPlayground(resolution?.entry.slug);
  }, [openPlayground, resolution]);

  return (
    <StyledWrapper
      className="appshell"
      data-testid={testId}
      data-dock={playgroundOpen ? playgroundDock : 'none'}
    >
      <div className="appshell-body" ref={bodyRef}>
        <Topbar
          layoutMode={mode}
          collectionName={collection?.info?.name || 'API Collection'}
          version={collection?.info?.version}
          logo={logo}
          searchSlot={<SearchBar open={searchOpen} onOpenChange={setSearchOpen} focusNonce={searchFocusNonce} />}
          searchOpen={searchOpen}
          onSearchOpenChange={setSearchOpen}
          onToggleSidebar={toggleSidebar}
          envSwitcherSlot={
            <>
              <ShowVarsToggle />
              <EnvSwitcher />
            </>
          }
          openInBrunoHref={buildFetchInBrunoUrl(gitCollectionUrl)}
        />

        <div className="appshell-main">
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
        </div>
      </div>

      {playgroundOpen && <Playground />}

      {!isDesktop && (
        <SidebarDrawer open={drawerOpen} onClose={closeDrawer}>
          <Sidebar onNavigate={closeDrawer} />
        </SidebarDrawer>
      )}
    </StyledWrapper>
  );
};

export default AppShell;
