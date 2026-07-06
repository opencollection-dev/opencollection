import { describe, it, expect } from 'vitest';
import {
  extractTests,
  extractTestNames,
  collectTests,
  collectRawTestScripts,
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
  it('orders tests by script flow, each with its source', () => {
    const collection: any = { info: { name: 'C' }, request: { scripts: [{ type: 'tests', code: "test('coll', () => {})" }] } };
    const folder: any = { info: { type: 'folder', name: 'F' }, request: { scripts: [{ type: 'tests', code: "test('fold', () => {})" }] } };
    const item: any = { runtime: { scripts: [{ type: 'tests', code: "test('req', () => {})" }] } };

    const sequential = collectTests(collection, [folder], item, 'sequential');
    expect(sequential.map((r) => `${r.level}:${r.name}`)).toEqual(['collection:coll', 'folder:fold', 'request:req']);

    const sandwich = collectTests(collection, [folder], item, 'sandwich');
    expect(sandwich.map((r) => `${r.level}:${r.name}`)).toEqual(['request:req', 'folder:fold', 'collection:coll']);
    expect(collectTests(collection, [folder], item).map((r) => r.level)).toEqual(['request', 'folder', 'collection']);
  });

  it('surfaces a raw-script row when a tests script has no test()/it() wrapper (not dropped)', () => {
    const item: any = { runtime: { scripts: [{ type: 'tests', code: 'expect(res.status).to.equal(200);' }] } };
    const rows = collectTests(null, [], item);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ level: 'request', name: 'Test script', raw: true, code: 'expect(res.status).to.equal(200);' });
  });

  it('does not surface a raw row for an empty/whitespace tests script', () => {
    const item: any = { runtime: { scripts: [{ type: 'tests', code: '   \n ' }] } };
    expect(collectTests(null, [], item)).toEqual([]);
  });
});

describe('collectRawTestScripts', () => {
  it('returns the complete authored script per non-empty level, in flow order', () => {
    const collection: any = { info: { name: 'C' }, request: { scripts: [{ type: 'tests', code: 'const s = 1;\ntest("coll", () => {})' }] } };
    const folder: any = { info: { type: 'folder', name: 'F' }, request: { scripts: [{ type: 'tests', code: '   ' }] } };
    const item: any = { runtime: { scripts: [{ type: 'tests', code: "test('req', () => {})" }] } };

    const sequential = collectRawTestScripts(collection, [folder], item, 'sequential');
    expect(sequential.map((s) => s.level)).toEqual(['collection', 'request']);
    expect(sequential[0].code).toBe('const s = 1;\ntest("coll", () => {})');
    expect(sequential[0].sourceName).toBe('C');

    const sandwich = collectRawTestScripts(collection, [folder], item);
    expect(sandwich.map((s) => s.level)).toEqual(['request', 'collection']);
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
