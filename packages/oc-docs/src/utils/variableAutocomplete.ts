import { mockDataFunctions } from '../runner/utils/faker-functions';

/** The `$`-prefixed mock/dynamic function hints, e.g. `$randomUUID` (Bruno's MOCK_DATA_HINTS). */
const MOCK_HINTS = Object.keys(mockDataFunctions).map((key) => `$${key}`);

/**
 * Matches an open `{{` with the (possibly empty) word typed after it, anchored to
 * the end of the text before the caret — Bruno's `VARIABLE_PATTERN`.
 */
const VARIABLE_CONTEXT_PATTERN = /\{\{([\w$.-]*)$/;

/** Characters that make up an "anyword" token (header name / mime type) — Bruno's WORD_PATTERN. */
const WORD_CHAR = /[\w.$/-]/;

export interface AutocompleteContext {
  /** The word typed so far. */
  word: string;
  /** Absolute index in the value where the word starts. */
  start: number;
}

/** Detect an open `{{…` variable context in the text before the caret, or null. */
export const getVariableContext = (textBeforeCaret: string): AutocompleteContext | null => {
  const match = VARIABLE_CONTEXT_PATTERN.exec(textBeforeCaret);
  if (!match) return null;
  return { word: match[1], start: match.index + 2 };
};

/**
 * The plain word immediately before the caret (for header-name / mime-type
 * completion), extending back over word characters. Empty word if the char
 * before the caret is not a word character.
 */
export const getWordContext = (textBeforeCaret: string): AutocompleteContext => {
  let start = textBeforeCaret.length;
  while (start > 0 && WORD_CHAR.test(textBeforeCaret[start - 1])) start -= 1;
  return { word: textBeforeCaret.slice(start), start };
};

/**
 * Filter `candidates` by the typed word (case-insensitive substring), ordered
 * prefix-matches-first then substring-only matches, each in code-unit order
 * (default `.sort()`, matching Bruno), deduped and capped at `max`. Empty word
 * yields nothing (Bruno shows no hints until >=1 character).
 */
const rankHints = (word: string, candidates: string[], max: number): string[] => {
  if (!word) return [];
  const lower = word.toLowerCase();
  const prefix: string[] = [];
  const substring: string[] = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    if (seen.has(candidate)) continue;
    const lowerCandidate = candidate.toLowerCase();
    if (lowerCandidate.startsWith(lower)) {
      seen.add(candidate);
      prefix.push(candidate);
    } else if (lowerCandidate.includes(lower)) {
      seen.add(candidate);
      substring.push(candidate);
    }
  }
  prefix.sort();
  substring.sort();
  return [...prefix, ...substring].slice(0, max);
};

/** Suggestions for a `{{word}}` context: user variable names + `$` mock functions. */
export const buildVariableSuggestions = (word: string, names: string[], max = 50): string[] =>
  rankHints(word, [...names, ...MOCK_HINTS], max);

/** Suggestions for a plain-word context from a static list (header names / mime types). */
export const buildAnywordSuggestions = (word: string, hints: string[], max = 50): string[] =>
  rankHints(word, hints, max);
