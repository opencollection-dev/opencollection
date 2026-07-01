import React from 'react';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import SidebarNavLink from '../SidebarNavLink/SidebarNavLink';
import { ChevronRightIcon } from '../../../../assets/icons';
import { StyledWrapper } from './StyledWrapper';
import { getItemName, isFolder, isScriptFile, getRequestBadgeLabel } from '../../../../utils/schemaHelpers';
import { getItemUuid } from '../../../../utils/itemUtils';
import { sortSiblings } from '../../../../routing/navModel';

interface SidebarTreeProps {
  items: OpenCollectionItem[];
  level?: number;
  activeSlug: string;
  uuidToSlug: Map<string, string>;
  onNavigate: (slug: string) => void;
  onToggleFolder: (uuid: string) => void;
}

const SidebarTree: React.FC<SidebarTreeProps> = ({
  items,
  level = 0,
  activeSlug,
  uuidToSlug,
  onNavigate,
  onToggleFolder,
}) => (
  <>
    {sortSiblings(items).map((item: OpenCollectionItem) => {
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
          <span
            className={`navlink-chevron${expanded ? ' expanded' : ''}`}
            role="button"
            aria-label={expanded ? 'Collapse folder' : 'Expand folder'}
            onClick={(e) => {
              e.stopPropagation();
              if (uuid) onToggleFolder(uuid);
            }}
          >
            <ChevronRightIcon />
          </span>
        );

        return (
          <div key={key}>
            <SidebarNavLink
              label={name}
              level={level}
              active={active}
              chevron={chevron}
              testId="sidebar-item"
              slug={slug}
              onClick={() => slug !== undefined && onNavigate(slug)}
            />
            {expanded && children.length > 0 && (
              <StyledWrapper style={{ '--guide-left': `${level * 14 + 14}px` } as React.CSSProperties}>
                <SidebarTree
                  items={children}
                  level={level + 1}
                  activeSlug={activeSlug}
                  uuidToSlug={uuidToSlug}
                  onNavigate={onNavigate}
                  onToggleFolder={onToggleFolder}
                />
              </StyledWrapper>
            )}
          </div>
        );
      }

      const script = isScriptFile(item);
      const displayName = script && !/\.[jt]s$/i.test(name) ? `${name}.js` : name;
      const method = getRequestBadgeLabel(item);

      return (
        <SidebarNavLink
          key={key}
          label={displayName}
          level={level}
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

export default SidebarTree;
