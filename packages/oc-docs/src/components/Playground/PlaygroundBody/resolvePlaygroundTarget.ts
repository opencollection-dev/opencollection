import type { NavModel } from '../../../routing/types';
import { ENVIRONMENTS_SLUG } from '../../../routing/navModel';
import { getItemUuid } from '../../../utils/itemUtils';

/**
 * The URL slot (`pgReq`) usually holds an item's slug. These two reserved values
 * stand for the environments and collection-settings views instead. They follow
 * the existing `~` sentinel convention (see ENVIRONMENTS_SLUG): real collections
 * don't name items with a leading `~`, so in practice they don't clash with an
 * item slug. The one exception would be an item literally named `~collection` /
 * `~environments` (slugifySegment keeps the `~`), which would then be shadowed.
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
  /** The item to select for a request/folder; null for the environments/collection views. */
  uuid: string | null;
  /**
   * Folders to open so the target shows up in the tree: its parent folders, and
   * the folder itself when the target is a folder (opening a folder shows its
   * contents, like the docs sidebar). Empty for the environments/collection views.
   */
  expandUuids: string[];
}

/**
 * Work out which view the URL's `pgReq` value should reopen on load.
 *
 * Returns null when the value points at an item the sidebar list hasn't loaded
 * yet (still loading after a reload); the caller then tries again once it has.
 * The `~environments` / `~collection` values resolve straight away.
 */
export function resolvePlaygroundTarget(slug: string, model: NavModel): PlaygroundTarget | null {
  if (slug === PLAYGROUND_ENVIRONMENTS_SLUG) return { view: 'environments', uuid: null, expandUuids: [] };
  if (slug === PLAYGROUND_COLLECTION_SLUG) return { view: 'collection-settings', uuid: null, expandUuids: [] };

  const entry = model.bySlug.get(slug);
  const uuid = entry ? getItemUuid(entry.item) : undefined;
  if (!entry || !uuid) return null; // not loaded yet - caller retries after the list loads

  const expandUuids: string[] = [];
  for (const ancestor of entry.ancestors) {
    const ancestorUuid = getItemUuid(model.bySlug.get(ancestor.slug)?.item);
    if (ancestorUuid) expandUuids.push(ancestorUuid);
  }
  // Open the folder itself too, so clicking a folder shows its contents in the
  // tree, like the docs sidebar. The chevron alone still just toggles it.
  if (entry.type === 'folder') expandUuids.push(uuid);
  return { view: entry.type === 'folder' ? 'folder-settings' : 'playground', uuid, expandUuids };
}
