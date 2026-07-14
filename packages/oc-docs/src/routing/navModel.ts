import type { OpenCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem, Folder } from '@opencollection/types/collection/item';
import { getItemName, getItemSeq, getItemType, isFolder, isScriptFile, getRequestBadgeLabel } from '../utils/schemaHelpers';
import { slugifySegment, dedupeSiblingSlugs } from './slug';
import type { BreadcrumbSegment, NavEntry, NavModel, PageType } from './types';

/** Overview lives at the hash root (`#/`). */
export const OVERVIEW_SLUG = '';
/** Built-ins are tilde-prefixed so user content can never collide with them. */
export const ENVIRONMENTS_SLUG = '~environments';

const isSeqValid = (seq: number | undefined): boolean =>
  typeof seq === 'number' && Number.isFinite(seq) && Number.isInteger(seq) && seq > 0;

/**
 * Ported 1:1 from the Bruno app (`bruno-app/src/utils/common`, named
 * `sortByNameThenSequence` there) so docs order matches the app. Sequence wins:
 * items with a valid seq are spliced into index `seq - 1` (same-seq grouped);
 * items without a seq keep their alphabetical position. Renamed here for clarity
 * since seq, not name, is the primary signal.
 */
const sortBySequenceElseName = (items: OpenCollectionItem[]): OpenCollectionItem[] => {
  const alphabetical = [...items].sort((a, b) => (getItemName(a) || '').localeCompare(getItemName(b) || ''));

  const withoutSeq: (OpenCollectionItem | OpenCollectionItem[])[] = alphabetical.filter(
    (item) => !isSeqValid(getItemSeq(item))
  );
  const withSeq = alphabetical
    .filter((item) => isSeqValid(getItemSeq(item)))
    .sort((a, b) => (getItemSeq(a) as number) - (getItemSeq(b) as number));

  withSeq.forEach((item) => {
    const position = (getItemSeq(item) as number) - 1;
    const existing = withoutSeq[position];
    const existingSeq = Array.isArray(existing)
      ? getItemSeq(existing[0])
      : existing
        ? getItemSeq(existing)
        : undefined;

    if (existingSeq === getItemSeq(item)) {
      const group = Array.isArray(existing) ? [...existing, item] : [existing as OpenCollectionItem, item];
      withoutSeq.splice(position, 1, group);
    } else {
      withoutSeq.splice(position, 0, item);
    }
  });

  return withoutSeq.flat();
};

/** Bruno app orders requests purely by seq. */
const sortBySequence = (items: OpenCollectionItem[]): OpenCollectionItem[] =>
  [...items].sort((a, b) => (getItemSeq(a) as number) - (getItemSeq(b) as number));

/**
 * Orders one level of sibling items for the sidebar/nav, matching the Bruno app.
 * Folders come first, then requests, then files. Folders are ordered by seq and
 * fall back to name; requests are ordered by seq; files keep their given order.
 * Called for each level (children are ordered when their folder is walked).
 */
export const orderSiblings = (items: OpenCollectionItem[]): OpenCollectionItem[] => {
  const present = items.filter(Boolean);
  const folders = present.filter((item) => isFolder(item));
  const files = present.filter((item) => isScriptFile(item));
  const requests = present.filter((item) => !isFolder(item) && !isScriptFile(item));
  return [...sortBySequenceElseName(folders), ...sortBySequence(requests), ...files];
};

const pageTypeOf = (item: OpenCollectionItem): PageType => {
  if (isFolder(item)) return 'folder';
  if (getItemType(item) === 'script') return 'script';
  return 'request';
};

const walk = (
  items: OpenCollectionItem[] | undefined,
  parentSlug: string,
  ancestors: BreadcrumbSegment[],
  depth: number,
  out: NavEntry[]
): void => {
  if (!items || items.length === 0) return;

  const ordered = orderSiblings(items);
  const segments = dedupeSiblingSlugs(
    ordered.map((item) => slugifySegment(getItemName(item) || ''))
  );

  ordered.forEach((item, i) => {
    const slug = parentSlug ? `${parentSlug}/${segments[i]}` : segments[i];
    const name = getItemName(item) || 'Untitled';
    const type = pageTypeOf(item);
    const badge = getRequestBadgeLabel(item);

    const entry: NavEntry = {
      slug,
      type,
      name,
      item,
      ancestors,
      depth,
      ...(badge ? { method: badge } : {}),
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

  // Environments always gets a nav entry, even when the collection has none:
  // the page itself renders an empty state ("No environments configured") so
  // the section stays discoverable in the sidebar. Mirrors the Overview entry.
  ordered.push({
    slug: ENVIRONMENTS_SLUG,
    type: 'environments',
    name: 'Environments',
    item: null,
    ancestors: [],
    depth: -1,
  });

  walk(collection?.items, '', [], 0, ordered);

  const bySlug = new Map<string, NavEntry>();
  for (const entry of ordered) {
    bySlug.set(entry.slug, entry);
  }

  return { ordered, bySlug };
};
