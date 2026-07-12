/**
 * Tiny dependency-free word-anchored matcher.
 *
 * `wordMatchQuality` returns `null` when `query` does not occur in `text` as a
 * contiguous, case-insensitive run that begins at a word boundary, otherwise a
 * number in [0, 1] where higher = better (a hit nearer the start of the text
 * ranks slightly higher). Because the match is a contiguous run anchored to a
 * word start, it matches a whole word or a word prefix but never a fragment
 * inside a longer word ("get" does not match "toGETher") and never a scattered
 * subsequence ("curs" does not match "Customers", where the letters appear only
 * as c-u-s...r...s). This guarantees every result literally contains the query.
 */

const isBoundaryChar = (ch: string | undefined): boolean =>
  ch === undefined ||
  ch === ' ' ||
  ch === '/' ||
  ch === '-' ||
  ch === '_' ||
  ch === '.' ||
  ch === ':' ||
  ch === '?' ||
  ch === '&' ||
  ch === '=';

export const wordMatchQuality = (query: string, text: string): number | null => {
  if (!query) return 0;
  if (!text) return null;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  for (let idx = t.indexOf(q); idx !== -1; idx = t.indexOf(q, idx + 1)) {
    if (isBoundaryChar(t[idx - 1])) {
      return Math.min(1, 0.9 + Math.max(0, 0.1 * (1 - idx / 40)));
    }
  }
  return null;
};
