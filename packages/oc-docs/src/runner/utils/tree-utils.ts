import type { OpenCollection } from '@opencollection/types';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Item, Folder } from '@opencollection/types/collection/item';
import { getItemName, getHttpMethod, getRequestUrl, isFolder, isHttpRequest } from '../../utils/schemaHelpers';
import { getAncestorsByUuid } from '../../utils/fileUtils';
import { getItemUuid } from '../../utils/itemUtils';

/**
 * Find the folder ancestors from the collection root to a specific item (the item excluded).
 *
 * Resolution prefers the stable hydrated `uuid`: two requests can share the same
 * name+method+url (e.g. a copy in another folder), and matching by content would return the
 * wrong one's ancestor chain — and therefore inherit auth/headers/variables from the wrong
 * parent. `getAncestorsByUuid` returns [] when the uuid isn't in the collection (an unhydrated or
 * stale item), which resolves from the collection only — safer than content-matching to a possibly
 * wrong duplicate. Content matching is kept only as a fallback for input that carries no uuid.
 */
export const getTreePathFromCollectionToItem = (
  collection: OpenCollection,
  targetItem: HttpRequest
): Item[] => {
  const uuid = getItemUuid(targetItem);
  if (uuid) {
    return getAncestorsByUuid(collection, uuid);
  }

  const path: Item[] = [];

  const findItemPath = (items: Item[] | undefined, currentPath: Item[] = []): boolean => {
    if (!items) return false;
    
    for (const item of items) {
      const newPath = [...currentPath, item];
      
      if (isHttpRequest(item) && isSameHttpRequest(item as HttpRequest, targetItem)) {
        path.push(...newPath);
        return true;
      }
      
      if (isFolder(item)) {
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
    getItemName(item1) === getItemName(item2) &&
    getHttpMethod(item1) === getHttpMethod(item2) &&
    getRequestUrl(item1) === getRequestUrl(item2)
  );
};
