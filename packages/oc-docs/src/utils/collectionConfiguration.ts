import type { HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';

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
