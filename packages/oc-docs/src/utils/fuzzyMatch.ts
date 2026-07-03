/**
 * Tiny dependency-free fuzzy matcher.
 *
 * A subsequence matcher with scoring, kept hand-rolled (no fuse.js etc.) so
 * the standalone bundle stays lean. `fuzzyScore` returns `null` when `query`
 * is not a (case-insensitive) subsequence of `text`, otherwise a number where
 * higher = better. Scoring favours, in order of weight:
 *   - matches at a word boundary (start, or after a space / `/` `-` `_` `.`)
 *   - consecutive runs of matched characters
 *   - tighter overall matches (shorter text, earlier first hit)
 */

const isBoundary = (ch: string): boolean =>
  ch === ' ' || ch === '/' || ch === '-' || ch === '_' || ch === '.' || ch === ':';

export const fuzzyScore = (query: string, text: string): number | null => {
  if (!query) return 0;
  if (!text) return null;

  const q = query.toLowerCase();
  const t = text.toLowerCase();

  let score = 0;
  let qi = 0;
  let prevMatchIdx = -1;
  let firstMatchIdx = -1;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] !== q[qi]) continue;

    if (firstMatchIdx === -1) firstMatchIdx = ti;

    let pts = 1;
    if (prevMatchIdx === ti - 1) {
      pts += 2; // consecutive run
    } else if (prevMatchIdx !== -1) {
      pts -= 2; // gap penalty: a tighter (contiguous) match should win
    }
    if (ti === 0 || isBoundary(t[ti - 1])) pts += 3; // word boundary

    score += pts;
    prevMatchIdx = ti;
    qi++;
  }

  if (qi < q.length) return null; // not all query chars consumed → no match

  // Tighter matches rank higher: small bonus for short text + early first hit.
  score += Math.max(0, 10 - t.length / 8);
  score += Math.max(0, 5 - firstMatchIdx);

  return score;
};
