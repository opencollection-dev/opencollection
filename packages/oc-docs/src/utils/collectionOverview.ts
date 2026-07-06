import type { OpenCollection } from '@opencollection/types';
import type { Item as CollectionItem } from '@opencollection/types/collection/item';
import type { HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { isFolder } from './schemaHelpers';

export interface CollectionStats {
  requestCount: number;
  folderCount: number;
  environmentCount: number;
}

export const countItems = (
  items: CollectionItem[] | undefined
): { requestCount: number; folderCount: number } => {
  let requestCount = 0;
  let folderCount = 0;

  const walk = (list: CollectionItem[] | undefined): void => {
    if (!list?.length) return;
    for (const item of list) {
      if (isFolder(item)) {
        folderCount += 1;
        walk((item as { items?: CollectionItem[] }).items);
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

export const hasConfiguredAuth = (auth?: Auth): boolean =>
  Boolean(auth) && (typeof auth !== 'object' || (auth as { type?: string }).type !== 'none');

export const hasCollectionConfiguration = (
  headers: HttpRequestHeader[] = [],
  auth?: Auth,
  scripts: CollectionScripts = {},
  hasVars = false
): boolean =>
  headers.some((header) => header && header.name) ||
  hasConfiguredAuth(auth) ||
  hasVars ||
  Boolean(scripts.preRequest || scripts.postResponse || scripts.tests);
