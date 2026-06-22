import type { OpenCollection } from '@opencollection/types';
import type { Item } from '@opencollection/types/collection/item';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Scripts } from '@opencollection/types/common/scripts';
import { getRequestScripts, scriptsArrayToObject, getItemName } from './schemaHelpers';

// Matches test('...') / it('...') / test.skip('...') with single, double, or backtick
// quotes; group 2 captures the title (handles escaped quotes inside the string).
const TEST_PATTERN = /\b(?:test|it)(?:\.\w+)?\s*\(\s*(['"`])((?:\\.|(?!\1).)*)\1/g;

/** Extract `test("name", …)` / `it("name", …)` titles from a tests script (no execution). */
export const extractTestNames = (code: string | undefined): string[] => {
  if (!code) return [];
  const names: string[] = [];
  TEST_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null = TEST_PATTERN.exec(code);
  while (match !== null) {
    names.push((match[2] ?? '').replace(/\\(['"`\\])/g, '$1').trim());
    match = TEST_PATTERN.exec(code);
  }
  return names;
};

export interface TestRow {
  level: 'request' | 'folder' | 'collection';
  sourceName?: string;
  name: string;
}

const testsCode = (scripts: Scripts | undefined): string | undefined => scriptsArrayToObject(scripts).tests;

const folderScripts = (folder: Item): Scripts | undefined =>
  (folder as { request?: { scripts?: Scripts } }).request?.scripts;

/**
 * Collect named tests from the collection, ancestor folders, and the request (tests
 * inherit collection → folders → request). Returns one row per `test()`/`it()` title.
 */
export const collectTests = (
  collection: OpenCollection | null | undefined,
  ancestors: Item[],
  item: HttpRequest
): TestRow[] => {
  const rows: TestRow[] = [];
  const add = (level: TestRow['level'], code: string | undefined, sourceName?: string): void => {
    extractTestNames(code).forEach((name) => rows.push({ level, name, sourceName }));
  };

  add('collection', testsCode(collection?.request?.scripts), collection?.info?.name);
  ancestors.forEach((folder) => add('folder', testsCode(folderScripts(folder)), getItemName(folder)));
  add('request', testsCode(getRequestScripts(item)));

  return rows;
};
