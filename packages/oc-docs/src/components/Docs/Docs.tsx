import React, { useEffect, useRef } from 'react';
import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import Sidebar from './Sidebar/Sidebar';
import Overview from '../../pages/Overview';
import { getItemId, generateSafeId } from '../../utils/itemUtils';
import { isFolder } from '../../utils/schemaHelpers';
import { useAppSelector } from '../../store/hooks';
import { selectSelectedItemId } from '../../store/slices/docs';

interface DocsProps {
  docsCollection: OpenCollectionCollection | null;
  filteredCollectionItems: any[];
  onOpenPlayground?: () => void;
}

const Docs: React.FC<DocsProps> = ({
  docsCollection,
  filteredCollectionItems,
}) => {
  const selectedItemId = useAppSelector(selectSelectedItemId);
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
        {docsCollection && (
          <Overview collection={docsCollection} />
        )}
      </div>
    </>
  );
};

export default Docs;

