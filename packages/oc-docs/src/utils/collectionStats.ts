import type { Item as OpenCollectionItem } from '@opencollection/types/collection/item';
import type { OpenCollection } from '@opencollection/types';
import { isFolder } from './schemaHelpers';

export interface CollectionStats {
  requestCount: number;
  folderCount: number;
  environmentCount: number;
}

export const countItems = (
  items: OpenCollectionItem[] | undefined
): { requestCount: number; folderCount: number } => {
  let requestCount = 0;
  let folderCount = 0;

  const walk = (list: OpenCollectionItem[] | undefined): void => {
    if (!list?.length) return;
    for (const item of list) {
      if (isFolder(item)) {
        folderCount += 1;
        walk((item as { items?: OpenCollectionItem[] }).items);
      } else {
        requestCount += 1;
      }
    }
  };

  walk(items);
  return { requestCount, folderCount };
};

// Summarises a collection: request, folder and environment counts.
export const getCollectionStats = (collection: OpenCollection | null | undefined): CollectionStats => {
  const { requestCount, folderCount } = countItems(collection?.items);
  return {
    requestCount,
    folderCount,
    environmentCount: collection?.config?.environments?.length ?? 0
  };
};
