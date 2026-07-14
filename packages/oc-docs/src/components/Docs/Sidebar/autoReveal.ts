import type { NavModel } from '../../../routing/types';
import { getItemUuid } from '../../../utils/itemUtils';

export interface AutoRevealResult {
  /** Whether the caller should record `activeSlug` as revealed. Only true once the
   *  model can actually resolve the slug, so a not-ready model never consumes it. */
  claim: boolean;
  /** Folder UUIDs to expand so the active item's ancestors (and, when the active
   *  item is itself a folder, that folder) become visible in the tree. */
  uuids: string[];
}

/**
 * Decide which folders to expand to reveal `activeSlug`, and whether to mark it
 * revealed, given the previously revealed slug and the current nav model.
 *
 * Returns `{ claim: false, uuids: [] }` when:
 *  - the slug was already revealed (so we never re-expand a folder the user then
 *    manually collapsed), or
 *  - the model cannot resolve the slug yet (collection still loading on reload).
 *    NOT claiming in this case is the fix: the reveal effect re-runs when the
 *    model hydrates and then expands the ancestors, instead of the slug being
 *    marked revealed too early and the folder staying collapsed on the page.
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
  // Also expand the active folder itself, so navigating to a folder reveals its
  // contents (folder rows navigate; the chevron toggles manually).
  if (entry.type === 'folder') {
    const uuid = getItemUuid(entry.item);
    if (uuid) uuids.push(uuid);
  }
  return { claim: true, uuids };
}
