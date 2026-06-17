/**
 * Derives the brand-avatar initials from a collection name.
 * - Two or more words → first letter of the first two words ("Hotel Booking API" → "HB").
 * - Single word → just its first letter ("Echo" → "E").
 * - Empty / nullish → "" (caller decides the fallback).
 *
 * Pure + DOM-free so it can be unit tested directly.
 */
export const getInitials = (collectionName?: string | null): string => {
  const words = (collectionName ?? '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '';
  }
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};
