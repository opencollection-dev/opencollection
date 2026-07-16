import type { NavModel } from '../../../routing/types';
import { getItemUuid } from '../../../utils/itemUtils';

export interface AutoRevealResult {
  /** True once the slug can be resolved, telling the caller to remember it as
   *  revealed. Stays false while the collection is still loading. */
  claim: boolean;
  /** Folders to open so the active item is visible: its parent folders, plus the
   *  folder itself when the active item is a folder. */
  uuids: string[];
}

/**
 * Work out which folders to open so `activeSlug` is visible in the tree, and
 * whether to remember it as already revealed.
 *
 * Returns nothing to do when:
 *  - it was already revealed (so a folder the user then closed stays closed), or
 *  - the collection is still loading, so the slug can't be resolved yet. Not
 *    marking it revealed here is the point: the effect runs again once the
 *    collection loads and opens the folders then, instead of giving up early and
 *    leaving them closed.
 */
export function computeAutoReveal(
  revealedSlug: string | null,
  activeSlug: string,
  model: NavModel
): AutoRevealResult {
  if (revealedSlug === activeSlug) return { claim: false, uuids: [] };

  const entry = model.bySlug.get(activeSlug);
  if (!entry) return { claim: false, uuids: [] };

  const uuids: string[] = [];
  for (const ancestor of entry.ancestors) {
    const uuid = getItemUuid(model.bySlug.get(ancestor.slug)?.item);
    if (uuid) uuids.push(uuid);
  }
  // Open the folder itself too, so going to a folder shows its contents. The
  // chevron alone still just toggles it.
  if (entry.type === 'folder') {
    const uuid = getItemUuid(entry.item);
    if (uuid) uuids.push(uuid);
  }
  return { claim: true, uuids };
}
