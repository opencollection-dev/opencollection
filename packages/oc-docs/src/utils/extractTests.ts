import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Scripts } from '@opencollection/types/common/scripts';
import { getRequestScripts, scriptsArrayToObject, getItemName } from './schemaHelpers';

// Matches the start of a test('...') / it('...') / test.skip('...') call with single,
// double, or backtick quotes; group 2 captures the title (handling escaped quotes).
const TEST_PATTERN = /\b(?:test|it)(?:\.\w+)?\s*\(\s*(['"`])((?:\\.|(?!\1).)*)\1/g;

/** A parsed test: its title and the full `test(...)` / `it(...)` source. */
export interface ParsedTest {
  name: string;
  code: string;
}

/**
 * Index of the `)` that closes the call whose opening `(` is at `open`. Parens
 * inside strings and comments are ignored so they don't unbalance the count.
 * Returns -1 if the call never closes. (Regex literals are not parsed, so a `)`
 * inside one is a known, rare edge case.)
 */
const closingParen = (code: string, open: number): number => {
  let depth = 0;
  for (let i = open; i < code.length; i += 1) {
    const ch = code[i];
    const next = code[i + 1];

    if (ch === "'" || ch === '"' || ch === '`') {
      i += 1;
      while (i < code.length && code[i] !== ch) i += code[i] === '\\' ? 2 : 1;
      continue;
    }
    if (ch === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i += 1;
      i += 1;
      continue;
    }
    if (ch === '(') depth += 1;
    else if (ch === ')' && (depth -= 1) === 0) return i;
  }
  return -1;
};

/** Parse `test("name", …)` / `it("name", …)` calls into title + full source. */
export const extractTests = (code: string | undefined): ParsedTest[] => {
  if (!code) return [];
  const tests: ParsedTest[] = [];
  TEST_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null = TEST_PATTERN.exec(code);
  while (match !== null) {
    const name = (match[2] ?? '').replace(/\\(['"`\\])/g, '$1').trim();
    const open = code.indexOf('(', match.index);
    const close = open === -1 ? -1 : closingParen(code, open);
    // Include the trailing `;` (if any) so the captured source reads as a statement.
    const end = close === -1 ? code.length : code[close + 1] === ';' ? close + 2 : close + 1;
    const source = code.slice(match.index, end).trim();
    tests.push({ name, code: source });
    match = TEST_PATTERN.exec(code);
  }
  return tests;
};

/** Titles only — kept as a thin convenience wrapper over {@link extractTests}. */
export const extractTestNames = (code: string | undefined): string[] => extractTests(code).map((t) => t.name);

export interface TestRow {
  level: 'request' | 'folder' | 'collection';
  sourceName?: string;
  name: string;
  /** The test's own source code (the full `test(...)` call). */
  code: string;
}

const testsCode = (scripts: Scripts | undefined): string | undefined => scriptsArrayToObject(scripts).tests;

const folderScripts = (folder: Item): Scripts | undefined =>
  (folder as { request?: { scripts?: Scripts } }).request?.scripts;

/**
 * Collect named tests from the collection, ancestor folders, and the request (tests
 * inherit collection → folders → request). Returns one row per `test()`/`it()`, each
 * carrying its own source code.
 */
export const collectTests = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  item: HttpRequest
): TestRow[] => {
  const rows: TestRow[] = [];
  const add = (level: TestRow['level'], code: string | undefined, sourceName?: string): void => {
    extractTests(code).forEach((test) => rows.push({ level, name: test.name, code: test.code, sourceName }));
  };

  add('collection', testsCode(collection?.request?.scripts), collection?.info?.name);
  ancestors.forEach((folder) => add('folder', testsCode(folderScripts(folder)), getItemName(folder)));
  add('request', testsCode(getRequestScripts(item)));

  return rows;
};
