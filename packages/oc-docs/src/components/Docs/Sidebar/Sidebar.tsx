import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

interface SidebarProps {
  onNavigate?: () => void;
  testId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, testId = 'sidebar' }) => {
  const dispatch = useAppDispatch();
  const collection = useAppSelector(selectDocsCollection);
  const model = useNavModel();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeSlug = normalizeSlug(pathname);

  const goTo = (slug: string) => {
    navigate(`/${slug}`);
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
          onClick={() => goTo(OVERVIEW_SLUG)}
        />
        {hasEnvironments && (
          <SidebarNavLink
            label="Environments"
            icon={<GlobeIcon />}
            active={activeSlug === ENVIRONMENTS_SLUG}
            testId="sidebar-environments"
            onClick={() => goTo(ENVIRONMENTS_SLUG)}
          />
        )}
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-items">
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
