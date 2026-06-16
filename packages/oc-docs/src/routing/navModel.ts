/**
 * Builds the navigation model (ordered sequence + slug lookup) for a
 * collection (BRU-3188). Pure, uuid-free, deterministic — the same collection
 * always yields the same slugs, so shared URLs survive reload and re-gen.
 */

import type { OpenCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import { getItemName, getItemSeq, getItemType, isFolder, getHttpMethod } from '../utils/schemaHelpers';
import { slugifySegment, dedupeSiblingSlugs } from './slug';
import type { BreadcrumbSegment, NavEntry, NavModel, PageType } from './types';

/** Overview lives at the hash root (`#/`). */
export const OVERVIEW_SLUG = '';
/** Built-ins are tilde-prefixed so user content can never collide with them. */
export const ENVIRONMENTS_SLUG = '~environments';

const hasEnvironments = (collection: OpenCollection): boolean => {
  const envs = (collection as { config?: { environments?: unknown[] } })?.config?.environments;
  return Array.isArray(envs) && envs.length > 0;
};

/** Sort siblings by seq (ascending), then by name — honours BRU-3403 reorder. */
export const sortSiblings = (items: OpenCollectionItem[]): OpenCollectionItem[] =>
  [...items].filter(Boolean).sort((a, b) => {
    const seqA = getItemSeq(a);
    const seqB = getItemSeq(b);
    if (seqA !== undefined && seqB !== undefined && seqA !== seqB) {
      return seqA - seqB;
    }
    if (seqA !== undefined && seqB === undefined) return -1;
    if (seqA === undefined && seqB !== undefined) return 1;
    return (getItemName(a) || '').localeCompare(getItemName(b) || '');
  });

const pageTypeOf = (item: OpenCollectionItem): PageType =>
  isFolder(item) ? 'folder' : 'request';

const walk = (
  items: OpenCollectionItem[] | undefined,
  parentSlug: string,
  ancestors: BreadcrumbSegment[],
  depth: number,
  out: NavEntry[]
): void => {
  if (!items || items.length === 0) return;

  const sorted = sortSiblings(items);
  const segments = dedupeSiblingSlugs(
    sorted.map((item) => slugifySegment(getItemName(item) || ''))
  );

  sorted.forEach((item, i) => {
    const slug = parentSlug ? `${parentSlug}/${segments[i]}` : segments[i];
    const name = getItemName(item) || 'Untitled';
    const type = pageTypeOf(item);

    const entry: NavEntry = {
      slug,
      type,
      name,
      item,
      ancestors,
      depth,
      ...(getItemType(item) === 'http' ? { method: getHttpMethod(item as HttpRequest) } : {}),
    };
    out.push(entry);

    if (isFolder(item)) {
      walk(
        (item as Folder).items,
        slug,
        [...ancestors, { name, slug }],
        depth + 1,
        out
      );
    }
  });
};

export const buildNavModel = (collection: OpenCollection | null | undefined): NavModel => {
  const ordered: NavEntry[] = [];

  ordered.push({
    slug: OVERVIEW_SLUG,
    type: 'overview',
    name: collection?.info?.name || 'Overview',
    item: null,
    ancestors: [],
    depth: -1,
  });

  if (collection && hasEnvironments(collection)) {
    ordered.push({
      slug: ENVIRONMENTS_SLUG,
      type: 'environments',
      name: 'Environments',
      item: null,
      ancestors: [],
      depth: -1,
    });
  }

  walk(collection?.items, '', [], 0, ordered);

  const bySlug = new Map<string, NavEntry>();
  for (const entry of ordered) {
    bySlug.set(entry.slug, entry);
  }

  return { ordered, bySlug };
};
