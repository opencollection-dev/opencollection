import type { HttpRequestHeader } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';

export interface CollectionScripts {
  preRequest?: string;
  postResponse?: string;
  tests?: string;
}

/**
 * True when a collection exposes any shared request defaults worth showing:
 * an enabled, named header, an auth scheme, or a pre-request / post-response /
 * test script. Used by the Overview page to decide whether the
 * "Collection Configuration" section should appear at all.
 */
export const hasCollectionConfiguration = (
  headers: HttpRequestHeader[] = [],
  auth?: Auth,
  scripts: CollectionScripts = {}
): boolean =>
  headers.some((header) => header && header.name && header.disabled !== true) ||
  Boolean(auth) ||
  Boolean(scripts.preRequest || scripts.postResponse || scripts.tests);
