/**
 * Utility functions for handling OpenCollection items
 */

import type { Item as OpenCollectionItem } from '@opencollection/types/collection/item';
import { getItemName, isFolder } from './schemaHelpers';

/**
 * Generate a safe HTML ID from an item name or ID
 * @param input The input string to convert to a safe ID
 * @returns A safe HTML ID string
 */
export const generateSafeId = (input: string): string => {
  if (!input) return 'unnamed-item';
  
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Get the effective ID for an item (prefers id, falls back to uid, then name from info block)
 * @param item The OpenCollection item
 * @returns The effective ID string
 */
export const getItemId = (item: any): string => {
  if (!item) return 'unnamed-item';
  return item.id || item.uid || getItemName(item) || item.name || 'unnamed-item';
};

/**
 * Read the runtime uuid hydrated onto an item.
 * @param item The OpenCollection item
 * @returns The uuid string, or undefined before hydration
 */
export const getItemUuid = (item: OpenCollectionItem | null | undefined): string | undefined =>
  (item as { uuid?: string } | null | undefined)?.uuid;

/**
 * Depth-first search for the item carrying `uuid` (matched via the hydrated
 * runtime uuid). Returns null when not found or the uuid is null.
 */
export const findItemByUuid = (
  items: OpenCollectionItem[] | undefined,
  uuid: string | null | undefined
): OpenCollectionItem | null => {
  if (!items || !uuid) return null;
  for (const item of items) {
    if (getItemUuid(item) === uuid) return item;
    if (isFolder(item)) {
      const found = findItemByUuid((item as { items?: OpenCollectionItem[] }).items, uuid);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Generate a section ID for use in HTML elements
 * @param item The OpenCollection item
 * @param parentPath Optional parent path for nested items
 * @returns A safe section ID
 */
export const generateSectionId = (item: any, parentPath?: string): string => {
  const itemId = getItemId(item);
  const safeItemId = generateSafeId(itemId);
  
  if (parentPath) {
    const safeParentPath = generateSafeId(parentPath);
    return `${safeParentPath}-${safeItemId}`;
  }
  
  return safeItemId;
};

/**
 * Sort OpenCollection items with folders first, then other items
 * @param items Array of OpenCollection items to sort
 * @returns Sorted array with folders first
 */
export const sortItemsWithFoldersFirst = (items: OpenCollectionItem[]): OpenCollectionItem[] => {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  
  return [...items].filter(item => item != null).sort((a, b) => {
    // Folders come first
    const aIsFolder = isFolder(a);
    const bIsFolder = isFolder(b);
    
    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;
    
    // Within the same type, sort alphabetically by name
    const nameA = getItemId(a).toLowerCase();
    const nameB = getItemId(b).toLowerCase();
    
    return nameA.localeCompare(nameB);
  });
}; 