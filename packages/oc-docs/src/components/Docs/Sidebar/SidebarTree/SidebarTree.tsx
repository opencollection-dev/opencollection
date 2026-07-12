import React, { useState } from 'react';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest, HttpRequestExample } from '@opencollection/types/requests/http';
import SidebarNavLink from '../SidebarNavLink/SidebarNavLink';
import { ChevronRightIcon, ExampleIcon } from '../../../../assets/icons';
import { StyledWrapper } from './StyledWrapper';
import { getItemName, isFolder, isScriptFile, getRequestBadgeLabel } from '../../../../utils/schemaHelpers';
import { getItemUuid } from '../../../../utils/itemUtils';
import { orderSiblings } from '../../../../routing/navModel';

export interface CollectionRoot {
  name: string;
  icon?: React.ReactNode;
  collapsed: boolean;
  active: boolean;
  onToggle: () => void;
  onClick: () => void;
  testId?: string;
}

interface SidebarTreeProps {
  items: OpenCollectionItem[];
  level?: number;
  activeSlug: string;
  uuidToSlug: Map<string, string>;
  onNavigate: (slug: string) => void;
  onToggleFolder: (uuid: string) => void;
  collectionRoot?: CollectionRoot;
  activeExample?: { requestUuid: string; index: number } | null;
  onExampleClick?: (requestUuid: string, index: number, request: HttpRequest) => void;
}

const SidebarTree: React.FC<SidebarTreeProps> = ({
  items,
  level = 0,
  activeSlug,
  uuidToSlug,
  onNavigate,
  onToggleFolder,
  collectionRoot,
  activeExample = null,
  onExampleClick,
}) => {
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(new Set());
  const toggleRequest = (uuid: string) =>
    setExpandedRequests((prev) => {
      const next = new Set(prev);
      if (next.has(uuid)) {
        next.delete(uuid);
      } else {
        next.add(uuid);
      }
      return next;
    });

  const renderItems = (itemList: OpenCollectionItem[], itemLevel: number): React.ReactNode => (
    <>
      {orderSiblings(itemList).map((item: OpenCollectionItem) => {
        const uuid = getItemUuid(item);
        const name = getItemName(item) || 'Untitled';
        const slug = uuid !== undefined ? uuidToSlug.get(uuid) : undefined;
        const active = slug !== undefined && slug === activeSlug;
        const key = uuid ?? name;

        if (isFolder(item)) {
          const collapsed = (item as { isCollapsed?: boolean }).isCollapsed ?? true;
          const expanded = !collapsed;
          const children = (item as Folder).items || [];

          const chevron = (
            <button
              type="button"
              className={`navlink-chevron${expanded ? ' expanded' : ''}`}
              aria-label={expanded ? 'Collapse folder' : 'Expand folder'}
              aria-expanded={expanded}
              onClick={(e) => {
                e.stopPropagation();
                if (uuid) onToggleFolder(uuid);
              }}
            >
              <ChevronRightIcon />
            </button>
          );

          return (
            <div key={key}>
              <SidebarNavLink
                label={name}
                level={itemLevel}
                active={active}
                chevron={chevron}
                testId="sidebar-item"
                slug={slug}
                onClick={() => slug !== undefined && onNavigate(slug)}
              />
              {expanded && children.length > 0 && (
                <StyledWrapper style={{ '--guide-left': `${itemLevel * 14 + 14}px` } as React.CSSProperties}>
                  {renderItems(children, itemLevel + 1)}
                </StyledWrapper>
              )}
            </div>
          );
        }

        const script = isScriptFile(item);
        const displayName = script && !/\.[jt]s$/i.test(name) ? `${name}.js` : name;
        const method = getRequestBadgeLabel(item);

        const examples: HttpRequestExample[] =
          !script && uuid !== undefined ? ((item as HttpRequest).examples ?? []) : [];

        if (examples.length > 0 && uuid !== undefined) {
          // Auto-expand when this request owns the active example, so navigating
          // to an example reveals it (and so static render can show it).
          const expanded = expandedRequests.has(uuid) || activeExample?.requestUuid === uuid;
          const chevron = (
            <button
              type="button"
              className={`navlink-chevron${expanded ? ' expanded' : ''}`}
              aria-label={expanded ? 'Collapse examples' : 'Expand examples'}
              aria-expanded={expanded}
              data-testid="sidebar-example-toggle"
              onClick={(e) => {
                e.stopPropagation();
                toggleRequest(uuid);
              }}
            >
              <ChevronRightIcon />
            </button>
          );

          return (
            <div key={key}>
              <SidebarNavLink
                label={displayName}
                level={itemLevel}
                active={active}
                method={method}
                muted
                chevron={chevron}
                testId="sidebar-item"
                slug={slug}
                onClick={() => slug !== undefined && onNavigate(slug)}
              />
              {expanded && (
                <StyledWrapper style={{ '--guide-left': `${itemLevel * 14 + 14}px` } as React.CSSProperties}>
                  {examples.map((example, i) => {
                    const isActive =
                      activeExample?.requestUuid === uuid && activeExample.index === i;
                    return (
                      <SidebarNavLink
                        key={`${uuid}-example-${i}`}
                        label={example.name || `Example ${i + 1}`}
                        level={itemLevel + 1}
                        active={isActive}
                        icon={<ExampleIcon />}
                        muted
                        testId="sidebar-example"
                        onClick={() => onExampleClick?.(uuid, i, item as HttpRequest)}
                      />
                    );
                  })}
                </StyledWrapper>
              )}
            </div>
          );
        }

        return (
          <SidebarNavLink
            key={key}
            label={displayName}
            level={itemLevel}
            active={active}
            method={method}
            mono={script}
            muted
            testId="sidebar-item"
            slug={slug}
            onClick={() => slug !== undefined && onNavigate(slug)}
          />
        );
      })}
    </>
  );

  if (collectionRoot) {
    const chevron = (
      <button
        type="button"
        className={`navlink-chevron${collectionRoot.collapsed ? '' : ' expanded'}`}
        aria-label={collectionRoot.collapsed ? 'Expand collection' : 'Collapse collection'}
        aria-expanded={!collectionRoot.collapsed}
        onClick={(e) => {
          e.stopPropagation();
          collectionRoot.onToggle();
        }}
      >
        <ChevronRightIcon />
      </button>
    );

    return (
      <>
        <SidebarNavLink
          label={collectionRoot.name}
          level={0}
          active={collectionRoot.active}
          icon={collectionRoot.icon}
          chevron={chevron}
          testId={collectionRoot.testId ?? 'sidebar-collection-root'}
          onClick={collectionRoot.onClick}
        />
        {!collectionRoot.collapsed && (
          <StyledWrapper style={{ '--guide-left': '14px' } as React.CSSProperties}>
            {renderItems(items, level + 1)}
          </StyledWrapper>
        )}
      </>
    );
  }

  return <>{renderItems(items, level)}</>;
};

export default SidebarTree;
