/**
 * Routing contract for page-based navigation (BRU-3188).
 *
 * These types are the cross-lane contract: the router (this lane) resolves a
 * slug to a `NavEntry` and hands a `PageProps` to the page component selected
 * by `PageType`. Page BODIES are built by other tickets (BRU-3569 request,
 * BRU-3571 overview, BRU-2548 environments) — they consume this contract and
 * MUST NOT depend on the runtime uuid.
 */

import type { OpenCollection } from '@opencollection/types';
import type { Item as OpenCollectionItem } from '@opencollection/types/collection/item';

export type PageType =
  | 'overview'
  | 'environments'
  | 'folder'
  | 'request'
  | 'script';

/** A single breadcrumb hop: a folder above the current node. */
export interface BreadcrumbSegment {
  name: string;
  slug: string;
}

/**
 * A resolved node in the navigation model. `item` is null for the built-in
 * pseudo-pages (overview, environments). `slug` is the full path-based,
 * uuid-free identifier; the overview slug is the empty string ('' -> `#/`).
 */
export interface NavEntry {
  slug: string;
  type: PageType;
  name: string;
  item: OpenCollectionItem | null;
  /** Folder chain strictly above this node (excludes self & the overview crumb). */
  ancestors: BreadcrumbSegment[];
  /** Depth in the item tree (0 = top level). Built-ins are -1. */
  depth: number;
  /** HTTP method, for request entries only. */
  method?: string;
}

/** A prev/next neighbour in the ordered sequence. */
export interface SeqNeighbor {
  slug: string;
  name: string;
  type: PageType;
  method?: string;
}

/**
 * The full navigation model for a collection: the ordered DFS sequence (used
 * for prev/next) plus a slug -> entry lookup (used for resolution).
 */
export interface NavModel {
  ordered: NavEntry[];
  bySlug: Map<string, NavEntry>;
}

/**
 * What every page component receives. Other lanes replace the page BODY but
 * consume exactly this shape. Breadcrumb + prev/next chrome is owned by this
 * lane (rendered by PageLayout), not the page body.
 */
export interface PageProps {
  node: NavEntry;
  prev?: SeqNeighbor;
  next?: SeqNeighbor;
  collection: OpenCollection;
  onOpenPlayground?: () => void;
}
