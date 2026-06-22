import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Auth } from '@opencollection/types/common/auth';
import { getRequestAuth, getItemName } from './schemaHelpers';

/** Human label for an auth mode (falls back to the raw type / "No Auth" / "Inherit"). */
export const humanizeAuthMode = (auth: Auth | undefined, labels: Record<string, string>): string => {
  if (!auth) return 'No Auth';
  if (auth === 'inherit') return 'Inherit';
  return labels[auth.type] || auth.type;
};

export interface ResolvedAuth {
  /** The effective auth (own auth, or the resolved inherited one). */
  auth?: Auth;
  /** Where an inherited auth came from. */
  source?: { level: 'collection' | 'folder'; name: string };
}

const folderAuth = (folder: Item): Auth | undefined =>
  (folder as { request?: { auth?: Auth } }).request?.auth;

const isConcrete = (auth: Auth | undefined): boolean => !!auth && auth !== 'inherit';

/**
 * Resolve `inherit` auth to its effective source: nearest ancestor folder with a
 * concrete auth, else the collection-level auth. Mirrors Bruno's inheritance walk.
 */
export const resolveInheritedAuth = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  item: HttpRequest
): ResolvedAuth => {
  const own = getRequestAuth(item) as Auth | undefined;
  if (own !== 'inherit') return { auth: own };

  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const auth = folderAuth(ancestors[i]);
    if (isConcrete(auth)) {
      return { auth, source: { level: 'folder', name: getItemName(ancestors[i]) || 'Folder' } };
    }
  }

  const collectionAuth = collection?.request?.auth as Auth | undefined;
  if (isConcrete(collectionAuth)) {
    return { auth: collectionAuth, source: { level: 'collection', name: collection?.info?.name || 'Collection' } };
  }

  return { auth: 'inherit' };
};
