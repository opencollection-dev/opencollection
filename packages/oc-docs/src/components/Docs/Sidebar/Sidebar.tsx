import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarNavLink from './SidebarNavLink/SidebarNavLink';
import SidebarTree from './SidebarTree/SidebarTree';
import SidebarFooter from './SidebarFooter/SidebarFooter';
import { CubeIcon, GlobeIcon } from '../../../assets/icons';
import { StyledWrapper } from './StyledWrapper';
import { computeAutoReveal } from './autoReveal';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleItem, expandFolders, selectDocsCollection } from '../../../store/slices/docs';
import { getItemUuid } from '../../../utils/itemUtils';
import { useNavModel } from '../../../routing/hooks';
import { normalizeSlug } from '../../../routing/resolve';
import { OVERVIEW_SLUG, ENVIRONMENTS_SLUG } from '../../../routing/navModel';
import { useDocsNavigate, useAutoHideScrollbar, useIsMobileDevice } from '../../../hooks';

interface SidebarProps {
  onNavigate?: () => void;
  testId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, testId = 'sidebar' }) => {
  const dispatch = useAppDispatch();
  const collection = useAppSelector(selectDocsCollection);
  const model = useNavModel();
  const docsNavigate = useDocsNavigate();
  const { pathname } = useLocation();
  const activeSlug = normalizeSlug(pathname);

  const goTo = (slug: string) => {
    docsNavigate(slug);
    onNavigate?.();
  };

  const uuidToSlug = useMemo<Map<string, string>>(() => {
    const map = new Map<string, string>();
    for (const entry of model.ordered) {
      const uuid = getItemUuid(entry.item);
      if (uuid) map.set(uuid, entry.slug);
    }
    return map;
  }, [model]);

  // Scrollbar thumb shows only while the list is active, then fades after 1s idle
  // (paired with the .sidebar-items[.scrolling] CSS below). Shared with the
  // playground sidebar so both behave identically.
  const itemsRef = useRef<HTMLDivElement>(null);
  useAutoHideScrollbar(itemsRef);

  // Slightly smaller nav text on real mobile/tablet OSes only. Gated on the
  // device (not viewport) so a shrunk laptop window keeps the 13px desktop size.
  const isMobileDevice = useIsMobileDevice();

  const autoRevealedSlug = useRef<string | null>(null);
  useEffect(() => {
    // On reload the collection loads async, so `model` may not resolve the active
    // slug on the first run. computeAutoReveal only "claims" the slug once it can,
    // so this effect re-runs when the model hydrates and expands the ancestors,
    // instead of the folder staying collapsed on the request page.
    const { claim, uuids } = computeAutoReveal(autoRevealedSlug.current, activeSlug, model);
    if (claim) autoRevealedSlug.current = activeSlug;
    if (uuids.length) dispatch(expandFolders(uuids));
  }, [activeSlug, model, dispatch]);

  return (
    <StyledWrapper className={`sidebar${isMobileDevice ? ' mobile' : ''}`} data-testid={testId}>
      <div className="sidebar-top-links">
        <SidebarNavLink
          label="Overview"
          icon={<CubeIcon />}
          active={activeSlug === OVERVIEW_SLUG}
          testId="sidebar-overview"
          onClick={() => goTo(OVERVIEW_SLUG)}
        />
        {/* Always shown, like Overview: with no environments the page renders
            an empty state, so the section must stay reachable from the sidebar. */}
        <SidebarNavLink
          label="Environments"
          icon={<GlobeIcon />}
          active={activeSlug === ENVIRONMENTS_SLUG}
          testId="sidebar-environments"
          onClick={() => goTo(ENVIRONMENTS_SLUG)}
        />
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-items" ref={itemsRef}>
        {collection?.items?.length ? (
          <SidebarTree
            items={collection.items}
            activeSlug={activeSlug}
            uuidToSlug={uuidToSlug}
            onNavigate={goTo}
            onToggleFolder={(uuid) => dispatch(toggleItem(uuid))}
          />
        ) : null}
      </div>

      <SidebarFooter />
    </StyledWrapper>
  );
};

export default Sidebar;
