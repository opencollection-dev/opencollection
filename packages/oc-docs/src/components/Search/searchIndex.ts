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

import type { NavEntry } from '../../routing/types';
import { getItemDocs, getItemDescription, getRequestUrl, getHttpParams } from '@utils/schemaHelpers';
import { getItemUuid } from '@utils/itemUtils';
import { fuzzyScore } from '@utils/fuzzyMatch';

export interface SearchRecord {
  /** Item UUID (the matchingItemIds contract + sidebar key). */
  id: string;
  /** Route target slug. */
  slug: string;
  name: string;
  method?: string;
  /** Folder chain for display, e.g. "Hotels / Browse & search". */
  breadcrumb: string;
  /** Ancestor folder slugs, for the folder filter chip. */
  ancestorSlugs: string[];
  url: string;
  params: string;
  description: string;
}

/** A folder offered in the palette's folder filter dropdown. */
export interface FolderOption {
  slug: string;
  name: string;
}

const paramsToText = (item: NavEntry['item']): string => {
  const params = getHttpParams(item as never) as Array<{ name?: string; value?: string }> | undefined;
  if (!Array.isArray(params)) return '';
  return params
    .map((p) => [p?.name, p?.value].filter(Boolean).join(' '))
    .filter(Boolean)
    .join(' ');
};

const descriptionOf = (item: NavEntry['item']): string => {
  const docs = getItemDocs(item) || '';
  const infoDesc = getItemDescription(item);
  return [infoDesc, docs].filter(Boolean).join(' ');
};

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
      params: paramsToText(entry.item),
      description: descriptionOf(entry.item),
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

/** Field weights: name dominates, then url, params, description. */
const FIELD_WEIGHTS: Array<[keyof Pick<SearchRecord, 'name' | 'url' | 'params' | 'description'>, number]> = [
  ['name', 10],
  ['url', 4],
  ['params', 2],
  ['description', 1],
];

/** Best weighted fuzzy score across a record's searchable fields, or null. */
export const scoreRecord = (query: string, rec: SearchRecord): number | null => {
  let best: number | null = null;
  for (const [field, weight] of FIELD_WEIGHTS) {
    const s = fuzzyScore(query, rec[field]);
    if (s === null) continue;
    const weighted = s * weight;
    best = best === null ? weighted : Math.max(best, weighted);
  }
  return best;
};

/**
 * Rank records against a query (text only; filters are applied separately by
 * the caller so they stay out of the shared slice). Empty query → [] (the
 * palette shows its initial empty state, not the whole collection).
 */
export const searchRecords = (query: string, records: SearchRecord[]): SearchRecord[] => {
  const q = query.trim();
  if (!q) return [];
  const scored: Array<{ rec: SearchRecord; score: number }> = [];
  for (const rec of records) {
    const score = scoreRecord(q, rec);
    if (score !== null) scored.push({ rec, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.rec);
};
