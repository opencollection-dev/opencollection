import type { OpenCollection as OpenCollectionCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import { isFolder } from './schemaHelpers';

/**
 * Helper function to find and update an item by UUID
 * @param items Array of items to search through
 * @param uuid The UUID of the item to find
 * @param updater Function to update the found item
 * @returns true if item was found and updated, false otherwise
 */
export const findAndUpdateItem = (
  items: OpenCollectionItem[] | undefined,
  uuid: string,
  updater: (item: any) => void
): boolean => {
  if (!items) return false;
  
  for (const item of items) {
    const itemUuid = (item as any).uuid;
    if (itemUuid === uuid) {
      updater(item);
      return true;
    }
    
    if (isFolder(item)) {
      const folder = item as Folder;
      if (folder.items && findAndUpdateItem(folder.items, uuid, updater)) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Traverses through the collection and assigns a UUID to each item
 * @param collection The OpenCollection to hydrate with UUIDs
 * @returns A new collection with UUIDs assigned to each item
 */
export const hydrateWithUUIDs = (collection: OpenCollectionCollection): OpenCollectionCollection => {
  const assignUUID = (item: OpenCollectionItem): OpenCollectionItem => {
    // Generate UUID if not already present
    const uuid = (item as any).uuid || crypto.randomUUID();
    
    // Create a new item with UUID
    const hydratedItem = { ...item, uuid } as any;
    
    // If it's a folder, recursively hydrate its children
    if (isFolder(item)) {
      const folder = item as Folder;
      if (folder.items && folder.items.length > 0) {
        hydratedItem.items = folder.items.map(assignUUID);
      }
    }
    
    return hydratedItem;
  };
  
  // Create a new collection object
  const hydratedCollection = { ...collection };
  
  // Hydrate all items if they exist
  if (collection.items && collection.items.length > 0) {
    hydratedCollection.items = collection.items.map(assignUUID);
  }
  
  return hydratedCollection;
};

