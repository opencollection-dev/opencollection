/**
 * Path-based slug helpers for shareable, stable page URLs (BRU-3188).
 *
 * Slugs are derived from the folder hierarchy + item names, never from the
 * runtime uuid, so a URL stays stable across reloads and across re-generation
 * of the docs from the same collection.
 */

/**
 * Convert a single item/folder name into one kebab-cased URL segment.
 * Lowercases, replaces runs of non-alphanumerics with a single dash, trims
 * dashes, and falls back to `unnamed` when nothing usable remains.
 */
export const slugifySegment = (name: string): string => {
  const slug = (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || 'unnamed';
};

/**
 * Disambiguate sibling segments that slugify to the same string by appending
 * `-2`, `-3`, ... The input order is significant and assumed already sorted
 * (seq -> name), so the result is deterministic and stable across re-gen.
 */
export const dedupeSiblingSlugs = (segments: string[]): string[] => {
  const used = new Set<string>();

  return segments.map((segment) => {
    if (!used.has(segment)) {
      used.add(segment);
      return segment;
    }

    let n = 2;
    let candidate = `${segment}-${n}`;
    while (used.has(candidate)) {
      n += 1;
      candidate = `${segment}-${n}`;
    }
    used.add(candidate);
    return candidate;
  });
};
