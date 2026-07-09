import { describe, it, expect } from 'vitest';
import {
  buildSearchRecords,
  collectTopLevelFolders,
  collectMethods,
  searchRecords,
  scoreRecord,
  type SearchRecord,
} from './searchIndex';
import type { NavEntry } from '../../routing/types';

const requestEntry = (over: Partial<NavEntry> & { uuid: string }): NavEntry => {
  const { uuid, ...rest } = over;
  return {
    slug: 'hotels/get-all',
    type: 'request',
    name: 'Get All Hotels',
    method: 'GET',
    ancestors: [{ name: 'Hotels', slug: 'hotels' }],
    depth: 1,
    item: {
      uuid,
      info: { name: 'Get All Hotels', type: 'http', description: 'List hotels' },
      http: { method: 'GET', url: '{{baseUrl}}/api/v1/hotels', params: [{ name: 'page', value: '1' }] },
    } as never,
    ...rest,
  };
};

describe('buildSearchRecords', () => {
  it('emits one record per request, keyed by item uuid', () => {
    const recs = buildSearchRecords([requestEntry({ uuid: 'u1' })]);
    expect(recs).toHaveLength(1);
    expect(recs[0].id).toBe('u1');
    expect(recs[0].slug).toBe('hotels/get-all');
    expect(recs[0].method).toBe('GET');
    expect(recs[0].breadcrumb).toBe('Hotels');
    expect(recs[0].url).toContain('/api/v1/hotels');
    expect(recs[0].params).toContain('page');
    expect(recs[0].description).toContain('List hotels');
  });

  it('indexes an object-form info.description ({ content }) as searchable text', () => {
    const entry = requestEntry({ uuid: 'u1' });
    (entry.item as { info: { description: unknown } }).info.description = {
      content: 'Cancels a reservation',
      type: 'text/markdown',
    };
    const recs = buildSearchRecords([entry]);
    expect(recs[0].description).toContain('Cancels a reservation');
    expect(recs[0].description).not.toContain('[object Object]');
  });

  it('excludes folders and built-in pages from records', () => {
    const folder: NavEntry = {
      slug: 'hotels', type: 'folder', name: 'Hotels', item: { uuid: 'f1' } as never,
      ancestors: [], depth: 0,
    };
    const overview: NavEntry = {
      slug: '', type: 'overview', name: 'Overview', item: null, ancestors: [], depth: -1,
    };
    expect(buildSearchRecords([folder, overview])).toHaveLength(0);
  });

  it('skips request items without a hydrated uuid (cannot key the sidebar)', () => {
    const entry = requestEntry({ uuid: '' });
    (entry.item as { uuid?: string }).uuid = undefined;
    expect(buildSearchRecords([entry])).toHaveLength(0);
  });
});

describe('collectTopLevelFolders', () => {
  it('returns only depth-0 folders', () => {
    const top: NavEntry = { slug: 'hotels', type: 'folder', name: 'Hotels', item: {} as never, ancestors: [], depth: 0 };
    const nested: NavEntry = { slug: 'hotels/x', type: 'folder', name: 'X', item: {} as never, ancestors: [], depth: 1 };
    expect(collectTopLevelFolders([top, nested, requestEntry({ uuid: 'u1' })])).toEqual([
      { slug: 'hotels', name: 'Hotels' },
    ]);
  });
});

describe('collectMethods', () => {
  it('dedupes and uppercases present methods in canonical order, custom last', () => {
    const folder: NavEntry = { slug: 'f', type: 'folder', name: 'F', item: {} as never, ancestors: [], depth: 0 };
    const entries = [
      requestEntry({ uuid: 'a', method: 'get' }),
      requestEntry({ uuid: 'b', method: 'PATCH' }),
      requestEntry({ uuid: 'c', method: 'GET' }),
      requestEntry({ uuid: 'd', method: 'PURGE' }),
      requestEntry({ uuid: 'e', method: 'HEAD' }),
      folder,
    ];
    expect(collectMethods(entries)).toEqual(['GET', 'PATCH', 'HEAD', 'PURGE']);
  });
});

const rec = (over: Partial<SearchRecord>): SearchRecord => ({
  id: 'id', slug: 's', name: '', method: 'GET', breadcrumb: '', ancestorSlugs: [],
  url: '', params: '', description: '', ...over,
});

describe('scoreRecord / searchRecords', () => {
  it('matches on name, url, params and description', () => {
    expect(scoreRecord('hotel', rec({ name: 'Get Hotels' }))).not.toBeNull();
    expect(scoreRecord('v1', rec({ url: '/api/v1/x' }))).not.toBeNull();
    expect(scoreRecord('page', rec({ params: 'page 1' }))).not.toBeNull();
    expect(scoreRecord('auth', rec({ description: 'authenticates the user' }))).not.toBeNull();
  });

  it('weights a name hit above a description-only hit', () => {
    const nameHit = scoreRecord('book', rec({ name: 'book' }))!;
    const descHit = scoreRecord('book', rec({ description: 'book' }))!;
    expect(nameHit).toBeGreaterThan(descHit);
  });

  it('empty query returns no results (initial empty state, not full list)', () => {
    expect(searchRecords('', [rec({ name: 'anything' })])).toEqual([]);
    expect(searchRecords('   ', [rec({ name: 'anything' })])).toEqual([]);
  });

  it('returns matches ranked by score, drops non-matches', () => {
    const a = rec({ id: 'a', name: 'Get All Hotels' });
    const b = rec({ id: 'b', name: 'Booking list' });
    const out = searchRecords('hotel', [a, b]);
    expect(out.map((r) => r.id)).toEqual(['a']);
  });
});
