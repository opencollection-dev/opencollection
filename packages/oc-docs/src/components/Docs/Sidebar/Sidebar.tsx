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
import { normalizeSlug, resolveSlug } from '../../../routing/resolve';
import { OVERVIEW_SLUG, ENVIRONMENTS_SLUG } from '../../../routing/navModel';
import { useDocsNavigate, useAutoHideScrollbar, useIsMobileDevice } from '../../../hooks';
import { useActiveExample } from './hooks/useActiveExample';

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
  // Resolve to the entry slug so an example path (<request>/<example>) still
  // highlights and auto-reveals its parent request, not the raw (unmatched) path.
  const activeSlug = resolveSlug(model, pathname)?.entry.slug ?? normalizeSlug(pathname);

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

  const { activeExample, goToExample } = useActiveExample(model, uuidToSlug, onNavigate);

  // Show the scrollbar while the list is in use, then fade it out after 1s idle.
  // Shared with the playground sidebar so both behave the same.
  const itemsRef = useRef<HTMLDivElement>(null);
  useAutoHideScrollbar(itemsRef);

  // Smaller nav text on real phones/tablets only. Based on the device, not the
  // window size, so a narrow laptop window keeps the normal 13px.
  const isMobileDevice = useIsMobileDevice();

  const autoRevealedSlug = useRef<string | null>(null);
  useEffect(() => {
    // Open the folders around the active item so it shows up in the tree. On
    // reload the collection loads a moment later, so computeAutoReveal waits
    // until it can resolve the slug; this effect runs again once it loads and
    // opens the folders then, instead of leaving them closed.
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
            // While an example is highlighted, only the example row is active,
            // not its parent request row (even though we navigated to that page).
            activeSlug={activeExample ? '' : activeSlug}
            uuidToSlug={uuidToSlug}
            onNavigate={goTo}
            onToggleFolder={(uuid) => dispatch(toggleItem(uuid))}
            onExpandFolder={(uuid) => dispatch(expandFolders([uuid]))}
            activeExample={activeExample}
            onExampleClick={goToExample}
          />
        ) : null}
      </div>

      <SidebarFooter />
    </StyledWrapper>
  );
};

export default Sidebar;
