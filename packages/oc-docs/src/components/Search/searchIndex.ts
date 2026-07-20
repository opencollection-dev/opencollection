/**
 * Search index for the endpoint palette.
 *
 * Turns the routing NavModel's ordered entries into flat, scoreable records,
 * one per HTTP/request node (folders are excluded from results; they surface in
 * the sidebar only as ancestors of a matched request). Each record's `id` is
 * the item UUID, the exact identifier the search slice + sidebar key on.
 *
 * Pure + React-free so it can be unit tested and memoized by the caller.
 */

import Fuse from 'fuse.js';
import type { IFuseOptions, FuseResultMatch } from 'fuse.js';
import type { NavEntry } from '../../routing/types';
import { getRequestUrl } from '../../utils/schemaHelpers';
import { getItemUuid } from '../../utils/itemUtils';

export interface SearchRecord {
  /** Item UUID (the matchingItemIds contract + sidebar key). */
  id: string;
  /** Route target slug. */
  slug: string;
  name: string;
  method?: string;
  /** Folder chain, searchable + displayed, e.g. "Hotels / Browse & search". */
  breadcrumb: string;
  /** Ancestor folder slugs, for the folder filter chip. */
  ancestorSlugs: string[];
  url: string;
}

/** A folder offered in the palette's folder filter dropdown. */
export interface FolderOption {
  slug: string;
  name: string;
}

/** Build the searchable records (request nodes only) from the nav model. */
export const buildSearchRecords = (entries: NavEntry[]): SearchRecord[] => {
  const records: SearchRecord[] = [];
  for (const entry of entries) {
    if (entry.type !== 'request' || !entry.item) continue;
    const id = getItemUuid(entry.item);
    if (!id) continue; // unhydrated, cannot key to the sidebar; skip
    records.push({
      id,
      slug: entry.slug,
      name: entry.name,
      method: entry.method,
      breadcrumb: entry.ancestors.map((a) => a.name).join(' / '),
      ancestorSlugs: entry.ancestors.map((a) => a.slug),
      url: getRequestUrl(entry.item as never),
    });
  }
  return records;
};

/** Top-level folders, for the folder filter dropdown. */
export const collectTopLevelFolders = (entries: NavEntry[]): FolderOption[] =>
  entries
    .filter((e) => e.type === 'folder' && e.depth === 0)
    .map((e) => ({ slug: e.slug, name: e.name }));

/** Canonical display order for method filters; anything not listed sorts last. */
const METHOD_DISPLAY_ORDER = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'];

/**
 * Distinct request methods present in the collection, uppercased, in canonical
 * order (custom methods last, alphabetical). Drives the method filters so any
 * method actually in use (PATCH/HEAD/OPTIONS/custom) is offered, not a fixed list.
 */
export const collectMethods = (entries: NavEntry[]): string[] => {
  const seen = new Set<string>();
  for (const e of entries) {
    if (e.type !== 'request') continue;
    const m = e.method?.toUpperCase();
    if (m) seen.add(m);
  }
  return [...seen].sort((a, b) => {
    const ia = METHOD_DISPLAY_ORDER.indexOf(a);
    const ib = METHOD_DISPLAY_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
};

/** Searchable + highlightable fields, in weight order (name dominates). */
type SearchField = 'name' | 'url' | 'breadcrumb';

/** Matched character ranges per field, as inclusive [start, end] pairs. */
export type FieldMatches = Partial<Record<SearchField, Array<[number, number]>>>;

/** A ranked result plus the ranges that matched, so the row can bold them. */
export interface SearchHit {
  record: SearchRecord;
  matches: FieldMatches;
}

/**
 * Fuse options tuned for endpoint search. Bitap gives typo tolerance
 * (`bikling` → `billing`) while matching a *contiguous* window, so a query
 * never stitches characters across separate words the way a subsequence would.
 * `ignoreLocation` is required because URLs are long and the match can sit
 * anywhere in them; `threshold` trades typo tolerance against noise.
 */
const FUSE_OPTIONS: IFuseOptions<SearchRecord> = {
  includeMatches: true,
  includeScore: true,
  ignoreLocation: true,
  threshold: 0.3,
  minMatchCharLength: 2,
  keys: [
    { name: 'name', weight: 3 },
    { name: 'url', weight: 2 },
    { name: 'breadcrumb', weight: 1 }
  ]
};

/** Build the Fuse index once per record set (memoize at the call site). */
export const createSearchIndex = (records: SearchRecord[]): Fuse<SearchRecord> =>
  new Fuse(records, FUSE_OPTIONS);

const collectMatches = (matches: readonly FuseResultMatch[] | undefined): FieldMatches => {
  const byField: FieldMatches = {};
  for (const m of matches ?? []) {
    const field = m.key as SearchField | undefined;
    if (!field) continue;
    byField[field] = m.indices.map(([start, end]) => [start, end]);
  }
  return byField;
};

/**
 * Rank records against a query (text only; filters are applied separately by
 * the caller). Empty query → [] (the palette shows its initial empty state,
 * not the whole collection). Results arrive already sorted by Fuse relevance.
 */
export const searchHits = (fuse: Fuse<SearchRecord>, query: string): SearchHit[] => {
  const q = query.trim();
  if (!q) return [];
  return fuse.search(q).map((r) => ({ record: r.item, matches: collectMatches(r.matches) }));
};
