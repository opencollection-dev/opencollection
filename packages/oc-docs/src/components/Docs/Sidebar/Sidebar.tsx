import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarNavLink from './SidebarNavLink/SidebarNavLink';
import SidebarTree from './SidebarTree/SidebarTree';
import SidebarFooter from './SidebarFooter/SidebarFooter';
import { CubeIcon, GlobeIcon } from '../../../assets/icons';
import { StyledWrapper } from './StyledWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleItem, expandFolders, selectDocsCollection } from '../../../store/slices/docs';
import { setExampleHighlight, selectExampleHighlight, clearExampleHighlight } from '../../../store/slices/docsExamples';
import { getItemUuid } from '../../../utils/itemUtils';
import { useNavModel } from '../../../routing/hooks';
import { normalizeSlug } from '../../../routing/resolve';
import { OVERVIEW_SLUG, ENVIRONMENTS_SLUG } from '../../../routing/navModel';
import { useDocsNavigate } from '../../../hooks';

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
  const activeExample = useAppSelector(selectExampleHighlight);

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

  const navPlain = (slug: string) => {
    dispatch(clearExampleHighlight());
    goTo(slug);
  };

  const goToExample = (requestUuid: string, index: number) => {
    const slug = uuidToSlug.get(requestUuid);
    if (slug === undefined) return;
    dispatch(setExampleHighlight({ requestUuid, index }));
    goTo(slug);
  };

  // Clear the example highlight once we have left the request page it points at,
  // so back/forward, a topbar link, or a deep-link never leaves it stale (which
  // would blank every active row and re-scroll the card on a later visit). Only
  // clears after the highlighted page was actually shown, avoiding the transient
  // set-then-navigate window from goToExample.
  const highlightSeenRef = useRef(false);
  useEffect(() => {
    if (!activeExample) {
      highlightSeenRef.current = false;
      return;
    }
    const highlightedSlug = uuidToSlug.get(activeExample.requestUuid);
    if (highlightedSlug === activeSlug) highlightSeenRef.current = true;
    else if (highlightSeenRef.current) dispatch(clearExampleHighlight());
  }, [activeSlug, activeExample, uuidToSlug, dispatch]);

  const autoRevealedSlug = useRef<string | null>(null);
  useEffect(() => {
    if (autoRevealedSlug.current === activeSlug) return;
    autoRevealedSlug.current = activeSlug;

    const entry = model.bySlug.get(activeSlug);
    if (!entry) return;

    const uuids: string[] = [];
    for (const ancestor of entry.ancestors) {
      const uuid = getItemUuid(model.bySlug.get(ancestor.slug)?.item);
      if (uuid) uuids.push(uuid);
    }
    // Also expand the active folder itself, so opening a folder reveals its
    // contents in the tree (folder rows navigate; the chevron toggles manually).
    if (entry.type === 'folder') {
      const uuid = getItemUuid(entry.item);
      if (uuid) uuids.push(uuid);
    }
    if (uuids.length) dispatch(expandFolders(uuids));
  }, [activeSlug, model, dispatch]);

  const hasEnvironments = Boolean(
    (collection as { config?: { environments?: unknown[] } })?.config?.environments?.length
  );

  return (
    <StyledWrapper className="sidebar" data-testid={testId}>
      <div className="sidebar-top-links">
        <SidebarNavLink
          label="Overview"
          icon={<CubeIcon />}
          active={activeSlug === OVERVIEW_SLUG}
          testId="sidebar-overview"
          onClick={() => navPlain(OVERVIEW_SLUG)}
        />
        {hasEnvironments && (
          <SidebarNavLink
            label="Environments"
            icon={<GlobeIcon />}
            active={activeSlug === ENVIRONMENTS_SLUG}
            testId="sidebar-environments"
            onClick={() => navPlain(ENVIRONMENTS_SLUG)}
          />
        )}
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-items">
        {collection?.items?.length ? (
          <SidebarTree
            items={collection.items}
            // While an example is highlighted, only the example row is active,
            // not its parent request row (even though we navigated to that page).
            activeSlug={activeExample ? '' : activeSlug}
            uuidToSlug={uuidToSlug}
            onNavigate={navPlain}
            onToggleFolder={(uuid) => dispatch(toggleItem(uuid))}
            activeExample={activeExample}
            onExampleClick={(requestUuid, index) => goToExample(requestUuid, index)}
          />
        ) : null}
      </div>

      <SidebarFooter />
    </StyledWrapper>
  );
};

export default Sidebar;
