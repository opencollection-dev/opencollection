import { describe, it, expect } from 'vitest';
import {
  extractTests,
  extractTestNames,
  collectTests,
  findItemByUuid,
  getAncestorsByUuid
} from './fileUtils';

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

describe('extractTests (source capture)', () => {
  it('captures each test\'s full source, not a fabricated snippet', () => {
    const code = 'test("a", function() {\n  expect(res.status).to.equal(200);\n});\nit(\'b\', () => { expect(1).to.equal(1); });';
    const tests = extractTests(code);
    expect(tests.map((t) => t.name)).toEqual(['a', 'b']);
    expect(tests[0].code).toBe('test("a", function() {\n  expect(res.status).to.equal(200);\n});');
    expect(tests[1].code).toBe("it('b', () => { expect(1).to.equal(1); });");
  });

  it('balances parens that appear inside strings and the body', () => {
    const code = 'test("x", () => { expect(")").to.equal(")"); });';
    expect(extractTests(code)[0].code).toBe(code);
  });

  it('ignores parens inside comments', () => {
    const code = 'test("y", () => {\n  // a ) here must not close the call\n  expect(1).to.equal(1);\n});';
    expect(extractTests(code)[0].code).toBe(code);
  });
});

describe('collectTests', () => {
  it('collects tests from collection, folders and request in order, each with its source', () => {
    const collection: any = { info: { name: 'C' }, request: { scripts: [{ type: 'tests', code: "test('coll', () => {})" }] } };
    const folder: any = { info: { type: 'folder', name: 'F' }, request: { scripts: [{ type: 'tests', code: "test('fold', () => {})" }] } };
    const item: any = { runtime: { scripts: [{ type: 'tests', code: "test('req', () => {})" }] } };
    const rows = collectTests(collection, [folder], item);
    expect(rows.map((r) => `${r.level}:${r.name}`)).toEqual(['collection:coll', 'folder:fold', 'request:req']);
    expect(rows[0].code).toBe("test('coll', () => {})");
  });
});

const collection: any = {
  items: [
    {
      uuid: 'f1',
      info: { type: 'folder', name: 'Auth' },
      items: [
        { uuid: 'r1', info: { type: 'http', name: 'Login' } },
        {
          uuid: 'f2',
          info: { type: 'folder', name: 'Sub' },
          items: [{ uuid: 'r2', info: { type: 'http', name: 'Deep' } }]
        }
      ]
    },
    { uuid: 'r3', info: { type: 'http', name: 'Top' } }
  ]
};

describe('itemTree', () => {
  it('finds an item by uuid, including nested ones', () => {
    expect((findItemByUuid(collection.items, 'r2') as any)?.info.name).toBe('Deep');
    expect((findItemByUuid(collection.items, 'r3') as any)?.info.name).toBe('Top');
    expect(findItemByUuid(collection.items, 'missing')).toBeNull();
  });

  it('returns folder ancestors from root to parent', () => {
    expect(getAncestorsByUuid(collection, 'r2').map((f: any) => f.info.name)).toEqual(['Auth', 'Sub']);
    expect(getAncestorsByUuid(collection, 'r1').map((f: any) => f.info.name)).toEqual(['Auth']);
    expect(getAncestorsByUuid(collection, 'r3')).toEqual([]);
  });
});
