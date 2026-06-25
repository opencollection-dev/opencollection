import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type { HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { isFolder } from './schemaHelpers';

export interface CollectionStats {
  requestCount: number;
  folderCount: number;
  environmentCount: number;
}

export const countItems = (
  items: Item[] | undefined
): { requestCount: number; folderCount: number } => {
  let requestCount = 0;
  let folderCount = 0;

  const walk = (list: Item[] | undefined): void => {
    if (!list?.length) return;
    for (const item of list) {
      if (isFolder(item)) {
        folderCount += 1;
        walk((item as { items?: Item[] }).items);
      } else {
        requestCount += 1;
      }
    }
  };

  walk(items);
  return { requestCount, folderCount };
};

export const getCollectionStats = (collection: OpenCollection | null | undefined): CollectionStats => {
  const { requestCount, folderCount } = countItems(collection?.items);
  return {
    requestCount,
    folderCount,
    environmentCount: collection?.config?.environments?.length ?? 0
  };
};

export interface CollectionScripts {
  preRequest?: string;
  postResponse?: string;
  tests?: string;
}

export const hasCollectionConfiguration = (
  headers: HttpRequestHeader[] = [],
  auth?: Auth,
  scripts: CollectionScripts = {}
): boolean =>
  headers.some((header) => header && header.name && header.disabled !== true) ||
  Boolean(auth) ||
  Boolean(scripts.preRequest || scripts.postResponse || scripts.tests);
