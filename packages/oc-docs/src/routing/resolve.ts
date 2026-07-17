import type { HttpRequest } from '@opencollection/types/requests/http';
import { OVERVIEW_SLUG } from './navModel';
import { exampleSlugs } from './slug';
import type { NavEntry, NavModel, SeqNeighbor } from './types';

export interface Resolution {
  entry: NavEntry;
  prev?: SeqNeighbor;
  next?: SeqNeighbor;
  /** Set when the path addresses a saved example of a request (leaf) entry. */
  example?: { slug: string; index: number };
}

/** Match a trailing path segment against a request entry's example slugs. */
const resolveExample = (entry: NavEntry, tail: string): { slug: string; index: number } | undefined => {
  if (entry.type !== 'request' || !entry.item) return undefined;
  const names = ((entry.item as HttpRequest).examples ?? []).map((example) => example.name);
  const index = exampleSlugs(names).indexOf(tail);
  return index >= 0 ? { slug: tail, index } : undefined;
};

/** Strip leading/trailing slashes; the bare root maps to the overview slug. */
export const normalizeSlug = (raw: string): string => {
  const trimmed = (raw || '').replace(/^\/+|\/+$/g, '');
  return trimmed || OVERVIEW_SLUG;
};

const toNeighbor = (entry: NavEntry): SeqNeighbor => ({
  slug: entry.slug,
  name: entry.name,
  type: entry.type,
  ...(entry.method ? { method: entry.method } : {}),
});

/** Resolve a slug to its entry + prev/next neighbours; null for unknown slugs. */
export const resolveSlug = (model: NavModel, raw: string): Resolution | null => {
  const slug = normalizeSlug(raw);
  let entry = model.bySlug.get(slug);
  let example: { slug: string; index: number } | undefined;

  if (!entry) {
    // A request is a routing leaf, so a path with an unmatched trailing segment
    // may address one of its examples: <request-slug>/<example-slug>. Resolve to
    // the parent request; `example` is set only when the tail matches an example
    // (an unmatched tail still lands on the request page, no highlight).
    const cut = slug.lastIndexOf('/');
    const parent = cut > 0 ? model.bySlug.get(slug.slice(0, cut)) : undefined;
    if (parent && parent.type === 'request') {
      entry = parent;
      example = resolveExample(parent, slug.slice(cut + 1));
    }
  }

  if (!entry) return null;

  const i = model.ordered.indexOf(entry);
  const prev = i > 0 ? model.ordered[i - 1] : undefined;
  const next = i < model.ordered.length - 1 ? model.ordered[i + 1] : undefined;

  return {
    entry,
    ...(prev ? { prev: toNeighbor(prev) } : {}),
    ...(next ? { next: toNeighbor(next) } : {}),
    ...(example ? { example } : {}),
  };
};
