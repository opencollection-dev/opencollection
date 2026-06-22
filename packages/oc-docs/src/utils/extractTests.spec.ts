import { describe, it, expect } from 'vitest';
import { extractTestNames, collectTests } from './extractTests';

describe('extractTestNames', () => {
  it('extracts test/it titles across quote styles', () => {
    const code = "test('a'); it(\"b\", () => {}); test(`c`);";
    expect(extractTestNames(code)).toEqual(['a', 'b', 'c']);
  });

  it('handles test.skip/only and escaped quotes', () => {
    const code = "test.skip('s'); test('it\\'s ok');";
    expect(extractTestNames(code)).toEqual(['s', "it's ok"]);
  });

  it('returns [] for empty input', () => {
    expect(extractTestNames(undefined)).toEqual([]);
    expect(extractTestNames('')).toEqual([]);
  });
});

describe('collectTests', () => {
  it('collects tests from collection, folders and request in order', () => {
    const collection: any = { info: { name: 'C' }, request: { scripts: [{ type: 'tests', code: "test('coll')" }] } };
    const folder: any = { info: { type: 'folder', name: 'F' }, request: { scripts: [{ type: 'tests', code: "test('fold')" }] } };
    const item: any = { runtime: { scripts: [{ type: 'tests', code: "test('req')" }] } };
    const rows = collectTests(collection, [folder], item);
    expect(rows.map((r) => `${r.level}:${r.name}`)).toEqual(['collection:coll', 'folder:fold', 'request:req']);
  });
});
