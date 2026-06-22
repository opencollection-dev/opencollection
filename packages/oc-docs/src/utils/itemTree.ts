import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import { isFolder } from './schemaHelpers';

const getUuid = (item: Item | null | undefined): string | undefined =>
  (item as { uuid?: string } | null | undefined)?.uuid;

const childItems = (item: Item): Item[] => ((item as { items?: Item[] }).items ?? []);

/** Depth-first search for an item by its hydrated `uuid`. */
export const findItemByUuid = (items: Item[] | undefined, uuid: string): Item | null => {
  if (!items || !uuid) return null;
  for (const item of items) {
    if (getUuid(item) === uuid) return item;
    if (isFolder(item)) {
      const found = findItemByUuid(childItems(item), uuid);
      if (found) return found;
    }
  }
  return null;
};

/** Folders on the path from the collection root to (but excluding) the item with `uuid`. */
export const getAncestorsByUuid = (collection: OpenCollection | null | undefined, uuid: string): Item[] => {
  if (!collection?.items || !uuid) return [];
  const path: Item[] = [];

  const walk = (items: Item[]): boolean => {
    for (const item of items) {
      if (getUuid(item) === uuid) return true;
      if (isFolder(item)) {
        path.push(item);
        if (walk(childItems(item))) return true;
        path.pop();
      }
    }
    return false;
  };

  walk(collection.items);
  return path;
};
