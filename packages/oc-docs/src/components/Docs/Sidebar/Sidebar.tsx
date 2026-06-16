import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import Method from '../Method/Method';
import OpenCollectionLogo from '../../../assets/opencollection-logo.svg';
import { SidebarContainer, SidebarItems, SidebarItem } from './StyledWrapper';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleItem, expandFolders, selectDocsCollection } from '../../../store/slices/docs';
import { getItemType, getItemName, getHttpMethod, isFolder } from '../../../utils/schemaHelpers';
import { getItemUuid } from '../../../utils/itemUtils';
import { useNavModel } from '../../../routing/hooks';
import { normalizeSlug } from '../../../routing/resolve';
import { OVERVIEW_SLUG, ENVIRONMENTS_SLUG, sortSiblings } from '../../../routing/navModel';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const collection = useAppSelector(selectDocsCollection);
  const model = useNavModel();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeSlug = normalizeSlug(pathname);

  // Active item is derived from the URL (not from redux selection).
  const goTo = (slug: string) => navigate(`/${slug}`);

  // Map each item's runtime uuid -> its stable slug for click navigation.
  const uuidToSlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of model.ordered) {
      const uuid = getItemUuid(entry.item);
      if (uuid) map.set(uuid, entry.slug);
    }
    return map;
  }, [model]);

  // Auto-expand (expand-only) the active node's ancestor folders — and the
  // active folder itself — so a deep-linked item is always visible.
  useEffect(() => {
    const entry = model.bySlug.get(activeSlug);
    if (!entry) return;

    const uuids: string[] = [];
    for (const ancestor of entry.ancestors) {
      const uuid = getItemUuid(model.bySlug.get(ancestor.slug)?.item);
      if (uuid) uuids.push(uuid);
    }
    if (entry.type === 'folder') {
      const uuid = getItemUuid(entry.item);
      if (uuid) uuids.push(uuid);
    }
    if (uuids.length) dispatch(expandFolders(uuids));
  }, [activeSlug, model, dispatch]);

  const renderFolderIcon = (isExpanded: boolean) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transform transition-transform duration-300"
      style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const renderItem = (item: OpenCollectionItem, level = 0) => {
    const itemIsFolder = isFolder(item);
    const itemType = getItemType(item);
    const itemName = getItemName(item);
    const itemUuid = getItemUuid(item);
    const itemSlug = itemUuid !== undefined ? uuidToSlug.get(itemUuid) : undefined;
    const isActive = itemSlug !== undefined && itemSlug === activeSlug;
    const isExpanded = itemIsFolder ? !((item as { isCollapsed?: boolean }).isCollapsed ?? true) : false;

    return (
      <div key={itemUuid ?? itemName} className="relative">
        <SidebarItem
          data-testid="sidebar-item"
          data-slug={itemSlug}
          className={`
            flex items-center select-none text-sm cursor-pointer
            ${isActive ? 'active' : ''}
            ${itemIsFolder ? 'folder' : ''}
            transition-all duration-200
          `}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => itemSlug !== undefined && goTo(itemSlug)}
        >
          {level > 0 && (
            <div
              className="absolute inset-y-0"
              style={{ left: `${(level - 1) * 16 + 14}px`, width: '1px', backgroundColor: 'var(--border-color)' }}
            />
          )}

          {itemIsFolder ? (
            <div
              className="mr-2 flex-shrink-0"
              role="button"
              aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
              onClick={(e) => {
                // Chevron toggles collapse independently of navigating to the folder page.
                e.stopPropagation();
                if (itemUuid) dispatch(toggleItem(itemUuid));
              }}
            >
              {renderFolderIcon(isExpanded)}
            </div>
          ) : (
            <Method method={itemType === 'http' ? getHttpMethod(item as HttpRequest) : 'GET'} className="text-xs" />
          )}

          <div className="truncate flex-1">{itemName}</div>
        </SidebarItem>

        {itemIsFolder && isExpanded && (item as Folder).items && (
          <div className="relative">
            <div
              className="absolute top-0 bottom-0 left-0"
              style={{ left: `${level * 16 + 14}px`, width: '1px', backgroundColor: 'var(--border-color)' }}
            />
            {sortSiblings((item as Folder).items || []).map((child: OpenCollectionItem) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const hasEnvironments = Boolean(
    (collection as { config?: { environments?: unknown[] } })?.config?.environments?.length
  );

  return (
    <SidebarContainer className="h-full flex flex-col" style={{ width: 'var(--sidebar-width)' }}>
      <div style={{ padding: '0 14px 10px 14px' }}>
        <div className="flex items-center gap-2">
          <h1
            className="truncate flex-1"
            style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '-0.01em', margin: 0 }}
          >
            {collection?.info?.name || 'API Collection'}
          </h1>
        </div>
      </div>

      <SidebarItems>
        {/* Built-in pages */}
        <SidebarItem
          className={`flex items-center select-none text-sm cursor-pointer ${activeSlug === OVERVIEW_SLUG ? 'active' : ''}`}
          style={{ paddingLeft: '8px' }}
          onClick={() => goTo(OVERVIEW_SLUG)}
        >
          <div className="truncate flex-1">Overview</div>
        </SidebarItem>

        {hasEnvironments && (
          <SidebarItem
            className={`flex items-center select-none text-sm cursor-pointer ${activeSlug === ENVIRONMENTS_SLUG ? 'active' : ''}`}
            style={{ paddingLeft: '8px' }}
            onClick={() => goTo(ENVIRONMENTS_SLUG)}
          >
            <div className="truncate flex-1">Environments</div>
          </SidebarItem>
        )}

        {collection?.items?.length ? sortSiblings(collection.items).map((item) => renderItem(item)) : null}
      </SidebarItems>

      <div className="p-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <a
          href="https://opencollection.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block opacity-50 hover:opacity-70 transition-opacity"
          style={{ minWidth: 0 }}
        >
          <img src={OpenCollectionLogo} alt="OpenCollection" className="max-w-[140px]" style={{ filter: 'grayscale(100%)' }} />
        </a>
        <ThemeToggle />
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;
