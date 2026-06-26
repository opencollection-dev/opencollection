/**
 * Builds a `bruno://` deep link that opens the desktop app and imports the
 * collection straight from its git remote.
 *
 * Pure + framework-agnostic so it can be unit tested and reused by any CTA.
 * Returns `undefined` when there is no usable git URL, letting callers omit
 * the link (render a disabled / hidden CTA) instead of producing a dead href.
 */
export const buildBrunoDeepLink = (gitUrl?: string | null): string | undefined => {
  const trimmed = gitUrl?.trim();
  if (!trimmed) {
    return undefined;
  }
  return `bruno://app/collection/import/git?url=${encodeURIComponent(trimmed)}`;
};
