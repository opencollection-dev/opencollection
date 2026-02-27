import React, { useMemo, useEffect } from 'react';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import Sidebar from './Sidebar/Sidebar';
import Item from './Item/Item';
import { getItemId, generateSafeId } from '../../utils/itemUtils';
import { isFolder } from '../../utils/schemaHelpers';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectSelectedItemId, selectItem } from '../../store/slices/docs';

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
  const prevSelectedItemId = React.useRef<string | null>(null);

  useEffect(() => {
    const hadPreviousSelection = prevSelectedItemId.current !== null;
    const selectionChanged = prevSelectedItemId.current !== selectedItemId;
    prevSelectedItemId.current = selectedItemId;

    if (!hadPreviousSelection || !selectionChanged) {
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
  const flattenItems = (items: any[], parentPath = ''): any[] => {
    const result: any[] = [];
    
    for (const item of items) {
      const itemId = getItemId(item);
      const itemPath = parentPath ? `${parentPath}/${itemId}` : itemId;
      
      // Add the item itself
      result.push(item);
      
      // If it's a folder, recursively add its children
      if (isFolder(item)) {
        const folder = item as any;
        if (folder.items && folder.items.length > 0) {
          result.push(...flattenItems(folder.items, itemPath));
        }
      }
    }
    
    return result;
  };

  const allItems = useMemo(() => {
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
          borderRight: '1px solid var(--border-color)'
        }}
      >
        <Sidebar />
      </div>

      <div
        className="playground-content h-full overflow-y-auto flex-1"
      >
        <div className="all-endpoints-view h-full overflow-y-auto" style={{ padding: '2rem', maxWidth: '100%' }}>
          {/* Collection Header */}
          {docsCollection && (
            <div
              className="collection-header mb-8 flex items-center gap-3"
              style={{ maxWidth: '80rem', marginLeft: 'auto', marginRight: 0 }}
            >
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {docsCollection.info?.name || 'API Collection'}
              </h1>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
              >
                <svg width="14" height="14" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                  <g id="color">
                    <path fill="#F4AA41" stroke="none" d="M23.5,14.5855l-4.5,1.75l-7.25,8.5l-4.5,10.75l2,5.25c1.2554,3.7911,3.5231,7.1832,7.25,10l2.5-3.3333 c0,0,3.8218,7.7098,10.7384,8.9598c0,0,10.2616,1.936,15.5949-0.8765c3.4203-1.8037,4.4167-4.4167,4.4167-4.4167l3.4167-3.4167 l1.5833,2.3333l2.0833-0.0833l5.4167-7.25L64,37.3355l-0.1667-4.5l-2.3333-5.5l-4.8333-7.4167c0,0-2.6667-4.9167-8.1667-3.9167 c0,0-6.5-4.8333-11.8333-4.0833S32.0833,10.6688,23.5,14.5855z"/>
                    <polygon fill="#EA5A47" stroke="none" points="36,47.2521 32.9167,49.6688 30.4167,49.6688 30.3333,53.5021 31.0833,57.0021 32.1667,58.9188 35,60.4188 39.5833,59.8355 41.1667,58.0855 42.1667,53.8355 41.9167,49.8355 39.9167,50.0855"/>
                    <polygon fill="#3F3F3F" stroke="none" points="32.5,36.9188 30.9167,40.6688 33.0833,41.9188 34.3333,42.4188 38.6667,42.5855 41.5833,40.3355 39.8333,37.0855"/>
                  </g>
                  <g id="line">
                    <path fill="#000000" stroke="none" d="M29.5059,30.1088c0,0-1.8051,1.2424-2.7484,0.6679c-0.9434-0.5745-1.2424-1.8051-0.6679-2.7484 s1.805-1.2424,2.7484-0.6679S29.5059,30.1088,29.5059,30.1088z"/>
                    <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M33.1089,37.006h6.1457c0.4011,0,0.7634,0.2397,0.9203,0.6089l1.1579,2.7245l-2.1792,1.1456 c-0.6156,0.3236-1.3654-0.0645-1.4567-0.754"/>
                    <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M34.7606,40.763c-0.1132,0.6268-0.7757,0.9895-1.3647,0.7471l-2.3132-0.952l1.0899-2.9035 c0.1465-0.3901,0.5195-0.6486,0.9362-0.6486"/>
                    <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M30.4364,50.0268c0,0-0.7187,8.7934,3.0072,9.9375c2.6459,0.8125,5.1497,0.5324,6.0625-0.25 c0.875-0.75,2.6323-4.4741,1.8267-9.6875"/>
                    <path fill="#000000" stroke="none" d="M44.2636,30.1088c0,0,1.805,1.2424,2.7484,0.6679c0.9434-0.5745,1.2424-1.8051,0.6679-2.7484 c-0.5745-0.9434-1.805-1.2424-2.7484-0.6679C43.9881,27.9349,44.2636,30.1088,44.2636,30.1088z"/>
                    <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M25.6245,42.8393c-0.475,3.6024,2.2343,5.7505,4.2847,6.8414c1.1968,0.6367,2.6508,0.5182,3.7176-0.3181l2.581-2.0233l2.581,2.0233 c1.0669,0.8363,2.5209,0.9548,3.7176,0.3181c2.0504-1.0909,4.7597-3.239,4.2847-6.8414"/>
                    <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M19.9509,28.3572c-2.3166,5.1597-0.5084,13.0249,0.119,15.3759c0.122,0.4571,0.0755,0.9355-0.1271,1.3631l-1.9874,4.1937 c-0.623,1.3146-2.3934,1.5533-3.331,0.4409c-3.1921-3.7871-8.5584-11.3899-6.5486-16.686 c7.0625-18.6104,15.8677-18.1429,15.8677-18.1429c2.8453-1.9336,13.1042-6.9375,24.8125,0.875c0,0,8.6323-1.7175,14.9375,16.9375 c1.8036,5.3362-3.4297,12.8668-6.5506,16.6442c-0.9312,1.127-2.7162,0.8939-3.3423-0.4272l-1.9741-4.1656 c-0.2026-0.4275-0.2491-0.906-0.1271-1.3631c0.6275-2.3509,2.4356-10.2161,0.119-15.3759"/>
                    <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M52.6309,46.4628c0,0-3.0781,6.7216-7.8049,8.2712"/>
                    <path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M19.437,46.969c0,0,3.0781,6.0823,7.8049,7.632"/>
                    <line x1="36.2078" x2="36.2078" y1="47.3393" y2="44.3093" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
                  </g>
                </svg>
                <span>Bruno Collection</span>
              </div>
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
                className={`endpoint-section mb-12 scroll-mt-20 ${isSelected ? 'selected' : ''}`}
              >
                <Item
                  item={item}
                  parentPath=""
                  collection={docsCollection || undefined}
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

