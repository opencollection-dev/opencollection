import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarNavLink from './SidebarNavLink/SidebarNavLink';
import SidebarTree from './SidebarTree/SidebarTree';
import SidebarFooter from './SidebarFooter/SidebarFooter';
import { CubeIcon, GlobeIcon } from '../../../assets/icons';
import { StyledWrapper } from './StyledWrapper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleItem, expandFolders, selectDocsCollection } from '../../../store/slices/docs';
import { getItemUuid } from '../../../utils/itemUtils';
import { useNavModel } from '../../../routing/hooks';
import { normalizeSlug } from '../../../routing/resolve';
import { OVERVIEW_SLUG, ENVIRONMENTS_SLUG } from '../../../routing/navModel';
import { useDocsNavigate } from '../../../hooks';
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

  const { activeExample, goToExample } = useActiveExample(model, activeSlug, uuidToSlug, onNavigate);

  // Reveal the scrollbar thumb only while the list is active (mousemove/scroll),
  // then hide it 1s after activity stops. Toggled via classList so pointer noise
  // never triggers a re-render.
  const itemsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = itemsRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      el.classList.add('scrolling');
      clearTimeout(timer);
      timer = setTimeout(() => el.classList.remove('scrolling'), 1000);
    };
    el.addEventListener('mousemove', show);
    el.addEventListener('scroll', show, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener('mousemove', show);
      el.removeEventListener('scroll', show);
    };
  }, []);

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

  return (
    <StyledWrapper className="sidebar" data-testid={testId}>
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
