import React, { useState } from 'react';
import { StyledWrapper } from './StyledWrapper';
import Brand from './Brand';
import OpenInBrunoButton from './OpenInBrunoButton';
import MobileOverflow from './MobileOverflow';
import { SearchIcon, HamburgerIcon } from './icons';
import { useTopbarLayout, showsHamburger } from './useTopbarLayout';

export interface TopbarProps {
  collectionName: string;
  version?: string;
  logo?: React.ReactNode;
  /** PRIMARY control, filled by BRU-3573. Rendered as-is; degrades when absent. */
  searchSlot?: React.ReactNode;
  /** SECONDARY controls (env switcher + show-vars), filled by BRU-3186. */
  envSwitcherSlot?: React.ReactNode;
  onOpenInBruno?: () => void;
  /** Optional `bruno://` deep link; when set the CTA renders as a real anchor. */
  openInBrunoHref?: string;
  /** Invoked by the mobile hamburger; the drawer itself is BRU-3574. */
  onToggleSidebar?: () => void;
}

/**
 * Sticky, purely-presentational top navigation bar.
 *
 * No routing, data fetching, or store access — everything arrives via props.
 * Composes small reusable subcomponents and exposes two slots (search,
 * env-switcher) that render whatever node is passed and degrade gracefully
 * when empty. Responsive layout: full bar (desktop), condensed with icon-only
 * CTA (tablet), single condensed row with hamburger + search-expand + overflow
 * popover (mobile).
 */
const Topbar: React.FC<TopbarProps> = ({
  collectionName,
  version,
  logo,
  searchSlot,
  envSwitcherSlot,
  onOpenInBruno,
  openInBrunoHref,
  onToggleSidebar,
}) => {
  const mode = useTopbarLayout();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const isMobile = mode === 'mobile';
  const isDesktop = mode === 'desktop';
  const hasSearch = searchSlot != null;
  const hasSecondary = envSwitcherSlot != null;

  const cta = (
    <OpenInBrunoButton
      href={openInBrunoHref}
      onClick={onOpenInBruno}
      iconOnly={!isDesktop}
    />
  );

  return (
    <StyledWrapper className="oc-topbar" data-mode={mode}>
      <div className="oc-topbar__bar">
        {showsHamburger(mode) && (
          <button
            type="button"
            className="oc-topbar__icon-btn"
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
          >
            <HamburgerIcon />
          </button>
        )}

        <Brand collectionName={collectionName} version={version} logo={logo} />

        {/* Flex-1 middle: inline search on tablet/desktop, else a spacer that
            keeps the right-hand controls + CTA pinned to the right edge —
            including when the search/env slots are empty. */}
        {hasSearch && !isMobile ? (
          <div className="oc-topbar__search">
            <div className="oc-topbar__search-inner">{searchSlot}</div>
          </div>
        ) : (
          <div className="oc-topbar__spacer" />
        )}

        {/* Mobile search toggle reveals the full-width search row below. */}
        {hasSearch && isMobile && (
          <button
            type="button"
            className="oc-topbar__icon-btn"
            aria-label="Search"
            aria-expanded={mobileSearchOpen}
            onClick={() => setMobileSearchOpen((prev) => !prev)}
          >
            <SearchIcon />
          </button>
        )}

        {/* Secondary controls: inline on tablet/desktop, overflow popover on mobile. */}
        {hasSecondary && !isMobile && (
          <div className="oc-topbar__secondary">{envSwitcherSlot}</div>
        )}
        {hasSecondary && isMobile && <MobileOverflow>{envSwitcherSlot}</MobileOverflow>}

        {cta}
      </div>

      {hasSearch && isMobile && mobileSearchOpen && (
        <div className="oc-topbar__search-row">
          <div className="oc-topbar__search-inner">{searchSlot}</div>
        </div>
      )}
    </StyledWrapper>
  );
};

export default Topbar;
