import type { NavModel } from '../../../routing/types';
import { ENVIRONMENTS_SLUG } from '../../../routing/navModel';
import { getItemUuid } from '../../../utils/itemUtils';

/**
 * Reserved `pgReq` tokens for the playground's non-item views. Item slugs are
 * slugified names and never start with `~`, so these can't collide.
 */
export const PLAYGROUND_ENVIRONMENTS_SLUG = ENVIRONMENTS_SLUG; // '~environments'
export const PLAYGROUND_COLLECTION_SLUG = '~collection';

export type PlaygroundViewMode =
  | 'playground'
  | 'folder-settings'
  | 'environments'
  | 'collection-settings';

export interface PlaygroundTarget {
  view: PlaygroundViewMode;
  /** Selected item uuid for item views; null for the environments / collection views. */
  uuid: string | null;
  /**
   * Folder uuids to expand so the target is revealed in the tree: the target's
   * ancestor folders, plus the target folder itself when it is a folder (so
   * opening a folder reveals its children, matching the docs sidebar). Empty for
   * the environments / collection views.
   */
  expandUuids: string[];
}

/**
 * Resolve a `pgReq` slug to the playground view it should restore on load.
 *
 * Returns null when the slug is an item slug the model cannot resolve yet (the
 * collection is still hydrating on reload) so the caller does NOT mark it applied
 * and re-runs once the model is ready. The `~environments` / `~collection` tokens
 * resolve immediately (no model needed).
 */
export function resolvePlaygroundTarget(slug: string, model: NavModel): PlaygroundTarget | null {
  if (slug === PLAYGROUND_ENVIRONMENTS_SLUG) return { view: 'environments', uuid: null, expandUuids: [] };
  if (slug === PLAYGROUND_COLLECTION_SLUG) return { view: 'collection-settings', uuid: null, expandUuids: [] };

  const entry = model.bySlug.get(slug);
  const uuid = entry ? getItemUuid(entry.item) : undefined;
  if (!entry || !uuid) return null; // item not resolvable yet -> retry after hydrate

  const expandUuids: string[] = [];
  for (const ancestor of entry.ancestors) {
    const ancestorUuid = getItemUuid(model.bySlug.get(ancestor.slug)?.item);
    if (ancestorUuid) expandUuids.push(ancestorUuid);
  }
  // Also expand the folder itself, so opening a folder reveals its contents in
  // the tree (folder rows navigate; the chevron toggles manually), same as docs.
  if (entry.type === 'folder') expandUuids.push(uuid);
  return { view: entry.type === 'folder' ? 'folder-settings' : 'playground', uuid, expandUuids };
}
