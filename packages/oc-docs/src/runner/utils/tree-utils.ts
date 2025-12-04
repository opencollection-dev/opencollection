import type { OpenCollection } from '@opencollection/types';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Item, Folder } from '@opencollection/types/collection/item';

/**
 * Find the path from collection root to a specific item
 */
export const getTreePathFromCollectionToItem = (
  collection: OpenCollection, 
  targetItem: HttpRequest
): Item[] => {
  const path: Item[] = [];
  
  const findItemPath = (items: Item[] | undefined, currentPath: Item[] = []): boolean => {
    if (!items) return false;
    
    for (const item of items) {
      const newPath = [...currentPath, item];
      
      if (item.type === 'http' && isSameHttpRequest(item as HttpRequest, targetItem)) {
        path.push(...newPath);
        return true;
      }
      
      if (item.type === 'folder') {
        const folder = item as Folder;
        if (findItemPath(folder.items, newPath)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  findItemPath(collection.items);
  
  // Remove the target item itself from the path (we only want the path TO the item)
  return path.slice(0, -1);
};

/**
 * Check if two HTTP requests are the same (for finding items in tree)
 */
const isSameHttpRequest = (item1: HttpRequest, item2: HttpRequest): boolean => {
  return (
    item1.name === item2.name &&
    item1.method === item2.method &&
    item1.url === item2.url
  );
};
