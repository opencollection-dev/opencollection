import React, { useCallback, useEffect, useState } from 'react';
import { StyledWrapper } from './StyledWrapper';
import Brand from './Brand/Brand';
import OpenInBrunoButton from '../OpenInBrunoButton/OpenInBrunoButton';
import IconButton from '../../ui/IconButton/IconButton';
import { SearchIcon, HamburgerIcon } from '../../assets/icons';
import { useTopbarLayout, showsHamburger, type TopbarLayoutMode } from '../../hooks/useTopbarLayout';
import { useCanRunBrunoApp } from '../../hooks/useCanRunBrunoApp';

export interface TopbarProps {
  collectionName: string;
  version?: string;
  logo?: React.ReactNode;
  /** Primary control slot. Rendered as-is; degrades when absent. */
  searchSlot?: React.ReactNode;
  /**
   * Below-desktop search-row open state. Optional: when provided (with
   * `onSearchOpenChange`) the row is controlled by the parent so the search
   * affordance can share one open-state with its slot content; when omitted the
   * Topbar manages it internally (backward compatible).
   */
  searchOpen?: boolean;
  onSearchOpenChange?: (open: boolean) => void;
  /** Secondary controls slot (env switcher + show-vars). */
  envSwitcherSlot?: React.ReactNode;
  onOpenInBruno?: () => void;
  /** Optional Fetch-in-Bruno URL; when set the CTA renders as an anchor. */
  openInBrunoHref?: string;
  /** Invoked by the mobile hamburger. */
  onToggleSidebar?: () => void;
  /**
   * Responsive mode override. When provided (by AppShell, derived from the docs
   * area width so the inline playground can shrink the docs chrome), it wins
   * over the window-width hook. Omitted in isolated/legacy use.
   */
  layoutMode?: TopbarLayoutMode;
  testId?: string;
}

/**
 * Sticky, purely-presentational top navigation bar.
 *
 * No routing, data fetching, or store access — everything arrives via props.
 * Composes small reusable subcomponents and exposes two slots (search,
 * env-switcher) that render whatever node is passed and degrade gracefully
 * when empty. Responsive layout:
 * - desktop (>=1024): full bar — brand · centered search · env switcher · Open-in-Bruno.
 * - tablet (768-1023): hamburger · brand · search icon · env switcher inline · Bruno glyph CTA.
 * - mobile (<768): hamburger · brand · search icon · env switcher · Bruno glyph CTA.
 * Below desktop the search collapses to an icon that expands a full-width row.
 *
 * Open-in-Bruno needs a device that can run the Bruno desktop app (capability
 * check, so a large touch tablet like the iPad Pro gets no CTA). It renders as
 * the full CTA on the desktop layout and condenses to the Bruno glyph below it
 * (e.g. when the inline playground has shrunk the docs area on a desktop).
 *
 * The responsive mode follows `layoutMode` when provided (AppShell passes the
 * docs-area-derived mode), else the window-width hook.
 */
const Topbar: React.FC<TopbarProps> = ({
  collectionName,
  version,
  logo,
  searchSlot,
  searchOpen: controlledSearchOpen,
  onSearchOpenChange,
  envSwitcherSlot,
  onOpenInBruno,
  openInBrunoHref,
  onToggleSidebar,
  layoutMode,
  testId = 'topbar',
}) => {
  const autoMode = useTopbarLayout();
  const mode = layoutMode ?? autoMode;
  const canRunBrunoApp = useCanRunBrunoApp();
  const [internalSearchOpen, setInternalSearchOpen] = useState(false);
  const isControlled = controlledSearchOpen !== undefined;
  const searchOpen = isControlled ? controlledSearchOpen : internalSearchOpen;
  const setSearchOpen = useCallback(
    (next: boolean) => {
      if (onSearchOpenChange) onSearchOpenChange(next);
      if (!isControlled) setInternalSearchOpen(next);
    },
    [onSearchOpenChange, isControlled],
  );

  const isMobile = mode === 'mobile';
  const isDesktop = mode === 'desktop';
  const hasSearch = searchSlot != null;
  const hasSecondary = envSwitcherSlot != null;
  const hasCta = openInBrunoHref != null || onOpenInBruno != null;

  // Collapse the revealed search row when entering the desktop layout, so it
  // doesn't reappear (with stale aria state) the next time search collapses.
  useEffect(() => {
    if (isDesktop) setSearchOpen(false);
  }, [isDesktop, setSearchOpen]);

  const searchInner = <div className="topbar-search-inner">{searchSlot}</div>;

  return (
    <StyledWrapper className="topbar" data-mode={mode} data-testid={testId}>
      <div className="topbar-bar">
        {showsHamburger(mode) && (
          <IconButton className="topbar-menu" label="Toggle sidebar" onClick={onToggleSidebar} data-testid="topbar-menu">
            <HamburgerIcon />
          </IconButton>
        )}

        <Brand collectionName={collectionName} version={version} logo={logo} compact={isMobile} />

        {/* Flex-1 middle: inline search on desktop, else a spacer that keeps the
            right-hand controls pinned to the right edge (search collapses to an
            icon below desktop, and may be empty). */}
        {hasSearch && isDesktop ? (
          <div className="topbar-search">{searchInner}</div>
        ) : (
          <div className="topbar-spacer" />
        )}

        {/* Below desktop: search toggle reveals the full-width search row below. */}
        {hasSearch && !isDesktop && (
          <IconButton
            label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <SearchIcon />
          </IconButton>
        )}

        {/* Secondary controls (env switcher + show-vars): inline at every
            breakpoint; the controls condense their own labels when narrow. */}
        {hasSecondary && <div className="topbar-secondary">{envSwitcherSlot}</div>}

        {/* Open-in-Bruno: shown on any device that can run the Bruno desktop app
            (capability check, hidden on large touch tablets like iPad Pro). It
            condenses to the Bruno glyph below the desktop layout, e.g. when the
            inline playground has shrunk the docs area on a desktop. */}
        {canRunBrunoApp && hasCta && (
          <OpenInBrunoButton href={openInBrunoHref} onClick={onOpenInBruno} iconOnly={!isDesktop} />
        )}
      </div>

      {hasSearch && !isDesktop && searchOpen && (
        <div className="topbar-search-row">{searchInner}</div>
      )}
    </StyledWrapper>
  );
};

export default Topbar;
