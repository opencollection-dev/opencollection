import React, { useMemo, useEffect, useRef } from 'react';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { StructuredText } from '@opencollection/types/common/description';
import Sidebar from './Sidebar/Sidebar';
import Item from './Item/Item';
import FetchInBrunoButton from './Sidebar/FetchInBrunoButton';
import { getItemId, generateSafeId } from '../../utils/itemUtils';
import { isFolder, getItemName } from '../../utils/schemaHelpers';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectSelectedItemId, selectItem } from '../../store/slices/docs';
import { selectGitCollectionUrl } from '../../store/slices/app';
import { useMarkdownRenderer } from '../../hooks';

interface DocsProps {
  docsCollection: OpenCollectionCollection | null;
  filteredCollectionItems: any[];
  onOpenPlayground?: () => void;
}

const Docs: React.FC<DocsProps> = ({
  docsCollection,
  filteredCollectionItems,
  onOpenPlayground
}) => {
  const dispatch = useAppDispatch();
  const selectedItemId = useAppSelector(selectSelectedItemId);
  const gitCollectionUrl = useAppSelector(selectGitCollectionUrl);
  const md = useMarkdownRenderer();
  const isInitialMount = useRef(true);

  // Scroll to selected item when it changes (but not on initial load)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (selectedItemId && filteredCollectionItems.length > 0) {
      // Find the item by UUID to get its safe ID for scrolling
      const findItemForScroll = (items: any[]): any => {
        for (const item of items) {
          const itemUuid = (item as any).uuid;
          const itemId = getItemId(item);
          const safeId = generateSafeId(itemId);
          
          // Check if this is the selected item
          if (itemUuid === selectedItemId || safeId === selectedItemId || itemId === selectedItemId) {
            return { item, safeId };
          }
          
          // If it's a folder, search recursively
          if (isFolder(item) && item.items) {
            const found = findItemForScroll(item.items);
            if (found) return found;
          }
        }
        return null;
      };

      const result = findItemForScroll(filteredCollectionItems);
      if (result) {
        // Scroll to the item after a short delay to ensure DOM is updated
        setTimeout(() => {
          const element = document.getElementById(`section-${result.safeId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [selectedItemId, filteredCollectionItems]);

  // Flatten all items recursively for rendering
  const breadcrumbMap = useRef<Map<string, Array<{ name: string; uuid: string }>>>(new Map());

  const flattenItems = (items: any[], breadcrumbPath: Array<{ name: string; uuid: string }> = []): any[] => {
    const result: any[] = [];

    for (const item of items) {
      const itemName = getItemName(item) || '';
      const itemUuid = (item as any).uuid || getItemId(item);

      breadcrumbMap.current.set(itemUuid, breadcrumbPath);

      result.push(item);

      if (isFolder(item)) {
        const folder = item as any;
        if (folder.items && folder.items.length > 0) {
          result.push(...flattenItems(folder.items, [...breadcrumbPath, { name: itemName, uuid: itemUuid }]));
        }
      }
    }

    return result;
  };

  const allItems = useMemo(() => {
    breadcrumbMap.current.clear();
    const items = flattenItems(filteredCollectionItems);
    return items;
  }, [filteredCollectionItems]);

  return (
    <>
      <div
        className="playground-sidebar h-full overflow-hidden flex flex-shrink-0"
        style={{
          width: 'var(--sidebar-width)',
          transition: 'width 0.3s ease',
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--oc-sidebar-bg)'
        }}
      >
        <Sidebar />
      </div>

      <div
        className="playground-content h-full overflow-y-auto flex-1"
      >
        <div className="all-endpoints-view h-full overflow-y-auto" style={{ maxWidth: '100%' }}>
          {docsCollection?.info?.name && (
            <div
              className="flex items-center gap-3"
              style={{
                maxWidth: '80rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              <h1
                className="truncate"
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.2,
                  margin: 0
                }}
              >
                {docsCollection.info.name}
              </h1>
              {gitCollectionUrl && (
                <a
                  href={`bruno://app/collection/import/git?url=${encodeURIComponent(gitCollectionUrl)}`}
                  className="flex-shrink-0"
                >
                  <FetchInBrunoButton />
                </a>
              )}
            </div>
          )}

          {/* Collection-level documentation/introduction */}
          {docsCollection?.docs && (
            <div
              className="collection-docs"
              data-testid="collection-docs-markdown"
              style={{
                maxWidth: '80rem',
                paddingTop: '1.5rem',
                paddingBottom: '2rem',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: md.render(
                    typeof docsCollection.docs === 'string'
                      ? docsCollection.docs
                      : (docsCollection.docs as StructuredText)?.content || ''
                  )
                }}
                className="markdown-documentation"
              />
            </div>
          )}

          {/* Render all collection items */}
          {allItems.map((item, index) => {
            const itemId = getItemId(item);
            const itemUuid = (item as any).uuid || itemId; // Use UUID if available, fallback to itemId
            const safeId = generateSafeId(itemId);
            const sectionId = `section-${safeId}`;
            // Compare with UUID first, then fallback to safeId/itemId for backward compatibility
            const isSelected = selectedItemId === itemUuid || selectedItemId === safeId || selectedItemId === itemId;

            return (
              <div
                key={`${itemUuid}-${index}`}
                id={sectionId}
                className={`endpoint-section scroll-mt-20 ${isSelected ? 'selected' : ''}`}
              >
                <Item
                  item={item}
                  parentPath=""
                  breadcrumb={breadcrumbMap.current.get(itemUuid) || []}
                  collection={docsCollection || undefined}
                  onBreadcrumbClick={(targetUuid: string) => {
                    dispatch(selectItem(targetUuid));
                    // Find the target item to get its safe ID for scrolling
                    const findTarget = (searchItems: any[]): string | null => {
                      for (const searchItem of searchItems) {
                        const searchUuid = (searchItem as any).uuid || getItemId(searchItem);
                        if (searchUuid === targetUuid) {
                          return generateSafeId(getItemId(searchItem));
                        }
                        if (isFolder(searchItem) && searchItem.items) {
                          const found = findTarget(searchItem.items);
                          if (found) return found;
                        }
                      }
                      return null;
                    };
                    const targetSafeId = findTarget(filteredCollectionItems);
                    if (targetSafeId) {
                      setTimeout(() => {
                        const element = document.getElementById(`section-${targetSafeId}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }
                  }}
                  onTryClick={() => {
                    // Select the item by UUID
                    dispatch(selectItem(itemUuid));
                    // Open the playground drawer
                    if (onOpenPlayground) {
                      onOpenPlayground();
                    }
                    // Scroll to the item
                    setTimeout(() => {
                      const element = document.getElementById(`section-${safeId}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                />
              </div>
            );
          })}

          {allItems.length === 0 && (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="mt-2 text-sm font-medium">No content available</h3>
                <p className="mt-1 text-sm">No endpoints or pages found in this collection.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Docs;

