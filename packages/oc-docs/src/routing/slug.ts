/**
 * Convert a single item/folder name into a URL segment.
 *
 * Whitespace becomes a `-` (kebab), letters/digits/`_`/`-` are kept as-is
 * (lowercased), and any other character is percent-encoded so the segment
 * stays unique and losslessly represented rather than collapsing to `unnamed`.
 * Keeping spaces as `-` means normal multi-word names stay readable
 * (`Create Booking` -> `create-booking`) and only true symbols get encoded.
 */
export const slugifySegment = (name: string): string => {
  // Whitespace -> `-` first (so multi-word names stay readable as kebab rather
  // than `%20`); encodeURIComponent then handles every other special character.
  const slug = encodeURIComponent((name || '').toLowerCase().replace(/\s+/g, '-'))
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'unnamed';
};

/** Append -2, -3, … to duplicate sibling segments; input must be pre-sorted for deterministic output. */
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
