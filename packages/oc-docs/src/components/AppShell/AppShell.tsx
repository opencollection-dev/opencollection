import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Topbar from '../Topbar/Topbar';
import EnvSwitcher from '../EnvSwitcher/EnvSwitcher';
import ShowVarsToggle from '../ShowVarsToggle/ShowVarsToggle';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import Sidebar from '../Docs/Sidebar/Sidebar';
import SidebarDrawer from '../SidebarDrawer/SidebarDrawer';
import IconButton from '../../ui/IconButton/IconButton';
import { ChevronLeftIcon, ChevronRightIcon } from '../../assets/icons';
import PageRouter from '../PageRouter/PageRouter';
import Playground from '../Playground/Playground';
import SearchBar from '../Search/SearchBar/SearchBar';
import { useSearchHotkey, usePlaygroundUrlState, useElementWidth, useResizableSidebar } from '../../hooks';
import { useAppSelector } from '../../store/hooks';
import { selectDocsCollection } from '../../store/slices/docs';
import { selectGitCollectionUrl } from '../../store/slices/app';
import { useActiveResolution } from '../../routing/hooks';
import { exampleSlugForIndex } from '../../routing/slug';
import type { HttpRequest } from '@opencollection/types/requests/http';
import { layoutModeForWidth } from '../../hooks/useTopbarLayout';
import { buildFetchInBrunoUrl } from '../../utils/buildFetchInBrunoUrl';
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
  const contentRef = useRef<HTMLElement>(null);
  const bodyWidth = useElementWidth(bodyRef);
  const mode = layoutModeForWidth(bodyWidth || (typeof window !== 'undefined' ? window.innerWidth : 1024));
  const isDesktop = mode === 'desktop';
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { width: sidebarWidth, startDrag: startSidebarResize } = useResizableSidebar(
    'oc-docs:docsSidebarWidth',
    () => setSidebarCollapsed(true),
    () => setSidebarCollapsed(false)
  );
  const { pathname } = useLocation();

  const { open: playgroundOpen, dock: playgroundDock, openPlayground, setRequestExample } = usePlaygroundUrlState();
  // Bumped on every Try click so the bottom sheet re-expands from collapsed even
  // when the requested slug is unchanged (a slug change alone wouldn't signal it).
  const [playgroundOpenNonce, setPlaygroundOpenNonce] = useState(0);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (content) content.scrollTop = 0;
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
    setPlaygroundOpenNonce((nonce) => nonce + 1);
  }, [openPlayground, resolution]);

  // Open the playground on a specific example of the current request (its Try
  // action): pgReq keeps the request, pgEx the example, so a share/reload lands
  // on the same read-only example view.
  const handleTryExample = (index: number) => {
    const entry = resolution?.entry;
    if (!entry) return;
    setRequestExample(entry.slug, exampleSlugForIndex(entry.item as HttpRequest | null, index));
  };

  return (
    <StyledWrapper
      className="appshell"
      data-testid={testId}
      data-dock={playgroundOpen ? playgroundDock : 'none'}
    >
      <div
        className="appshell-body"
        ref={bodyRef}
        style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
      >
        <Topbar
          layoutMode={mode}
          collectionName={collection?.info?.name || 'API Collection'}
          version={collection?.info?.version}
          logo={logo}
          searchSlot={
            <SearchBar
              open={searchOpen}
              onOpenChange={setSearchOpen}
              focusNonce={searchFocusNonce}
              collapsed={!isDesktop}
            />
          }
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
          themeToggleSlot={<ThemeToggle />}
        />

        <div className="appshell-main">
          <div className="appshell-row">
            {isDesktop && !sidebarCollapsed && (
              <>
                <aside className="appshell-sidebar" data-testid="app-sidebar">
                  <Sidebar />
                </aside>
                <div
                  className="appshell-sidebar-resizer"
                  data-testid="sidebar-resizer"
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize sidebar"
                  onPointerDown={startSidebarResize}
                />
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
            <main className="appshell-content" ref={contentRef}>
              <PageRouter onOpenPlayground={handleOpenPlayground} onTryExample={handleTryExample} />
            </main>
          </div>
        </div>
      </div>

      {playgroundOpen && <Playground openNonce={playgroundOpenNonce} />}

      {!isDesktop && (
        <SidebarDrawer open={drawerOpen} onClose={closeDrawer}>
          <Sidebar onNavigate={closeDrawer} />
        </SidebarDrawer>
      )}
    </StyledWrapper>
  );
};

export default AppShell;
