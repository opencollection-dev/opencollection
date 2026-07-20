import { describe, it, expect } from 'vitest';
import {
  buildSearchRecords,
  collectTopLevelFolders,
  collectMethods,
  createSearchIndex,
  searchHits,
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
  });

  it('does not carry params or description onto the record (out of search scope)', () => {
    const recs = buildSearchRecords([requestEntry({ uuid: 'u1' })]);
    expect(recs[0]).not.toHaveProperty('params');
    expect(recs[0]).not.toHaveProperty('description');
  });

  it('joins the ancestor chain into a breadcrumb', () => {
    const entry = requestEntry({
      uuid: 'u1',
      ancestors: [
        { name: 'Billing', slug: 'billing' },
        { name: 'Lookups', slug: 'billing/lookups' },
      ],
    });
    expect(buildSearchRecords([entry])[0].breadcrumb).toBe('Billing / Lookups');
    expect(buildSearchRecords([entry])[0].ancestorSlugs).toEqual(['billing', 'billing/lookups']);
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
  id: 'id', slug: 's', name: '', method: 'GET', breadcrumb: '', ancestorSlugs: [], url: '', ...over,
});

/** Substrings the reported ranges actually cover, for match-locality assertions. */
const matchedText = (text: string, ranges?: Array<[number, number]>): string[] =>
  (ranges ?? []).map(([start, end]) => text.slice(start, end + 1));

const ids = (hits: ReturnType<typeof searchHits>): string[] => hits.map((h) => h.record.id);

// A small, representative billing collection reused across the matching tests.
const BILLING: SearchRecord[] = [
  rec({ id: 'payments', name: 'Get All Payments', breadcrumb: 'Billing', url: '{{baseUrl}}/billing/payments' }),
  rec({ id: 'invoices', name: 'Get All Invoices', breadcrumb: 'Billing', url: '{{baseUrl}}/billing/invoices' }),
  rec({ id: 'customers', name: 'Get All Customers', breadcrumb: 'Billing', url: '{{baseUrl}}/billing/customers' }),
  rec({ id: 'subs', name: 'Get All Subscriptions', breadcrumb: 'Billing', url: '{{baseUrl}}/billing/subscriptions' }),
  rec({ id: 'currencies', name: 'Get Currencies', breadcrumb: 'Billing / Lookups', url: '{{baseUrl}}/billing/lookups/currencies' }),
];

describe('searchHits — empty & degenerate queries', () => {
  it('empty / whitespace query returns no results (initial empty state)', () => {
    const fuse = createSearchIndex([rec({ name: 'anything' })]);
    expect(searchHits(fuse, '')).toEqual([]);
    expect(searchHits(fuse, '   ')).toEqual([]);
  });

  it('a single character does not match (minMatchCharLength = 2)', () => {
    const fuse = createSearchIndex(BILLING);
    expect(searchHits(fuse, 'p')).toEqual([]);
  });

  it('gibberish returns nothing (no false positives)', () => {
    const fuse = createSearchIndex(BILLING);
    expect(searchHits(fuse, 'zzzzz')).toEqual([]);
    expect(searchHits(fuse, 'qwxyz')).toEqual([]);
  });
});

describe('searchHits — exact matches per field', () => {
  it('matches on the name', () => {
    const fuse = createSearchIndex(BILLING);
    expect(ids(searchHits(fuse, 'invoices'))).toContain('invoices');
  });

  it('matches on the url', () => {
    const fuse = createSearchIndex([rec({ id: 'x', name: 'Unrelated', url: '{{baseUrl}}/api/v1/hotels' })]);
    expect(ids(searchHits(fuse, 'hotels'))).toContain('x');
  });

  it('matches on the folder chain (breadcrumb)', () => {
    const fuse = createSearchIndex([rec({ id: 'x', name: 'Get item', breadcrumb: 'Billing / Lookups' })]);
    expect(ids(searchHits(fuse, 'lookups'))).toContain('x');
  });

  it('is case-insensitive', () => {
    const fuse = createSearchIndex(BILLING);
    expect(ids(searchHits(fuse, 'PAYMENTS'))).toContain('payments');
    expect(ids(searchHits(fuse, 'PaYmEnTs'))).toContain('payments');
  });
});

describe('searchHits — typo tolerance', () => {
  it('tolerates a one-character error', () => {
    const fuse = createSearchIndex(BILLING);
    expect(ids(searchHits(fuse, 'paymnt'))).toContain('payments'); // dropped letter
    expect(ids(searchHits(fuse, 'invoises'))).toContain('invoices'); // substitution
    expect(ids(searchHits(fuse, 'custmers'))).toContain('customers');
  });

  it('tolerates a transposition / two-character error', () => {
    const fuse = createSearchIndex(BILLING);
    expect(ids(searchHits(fuse, 'paymnet'))).toContain('payments');
    expect(ids(searchHits(fuse, 'subscripton'))).toContain('subs');
  });

  it('the intended record ranks first for a typo', () => {
    const fuse = createSearchIndex(BILLING);
    expect(searchHits(fuse, 'invoises')[0].record.id).toBe('invoices');
  });
});

describe('searchHits — precision (threshold 0.3)', () => {
  it('does not bleed a shared prefix into an unrelated word (cursor !-> currencies)', () => {
    const fuse = createSearchIndex(BILLING);
    expect(ids(searchHits(fuse, 'cursor'))).not.toContain('currencies');
  });
});

describe('searchHits — match locality (no cross-word stitching)', () => {
  it('highlights the real word, not a stray leading char from another token', () => {
    const fuse = createSearchIndex(BILLING);
    const hit = searchHits(fuse, 'billing').find((h) => h.record.id === 'payments')!;
    const url = hit.record.url;
    const subs = matchedText(url, hit.matches.url);
    // The matched span is the word "billing" itself...
    expect(subs).toContain('billing');
    // ...never the "b" of "{{baseUrl}}" at index 2.
    expect(hit.matches.url?.map(([start]) => start)).not.toContain(2);
  });
});

describe('searchHits — ranking & weights', () => {
  it('ranks a name hit above a folder-only hit', () => {
    const named = rec({ id: 'named', name: 'Booking' });
    const foldered = rec({ id: 'foldered', name: 'Get item', breadcrumb: 'Booking / Active' });
    const fuse = createSearchIndex([foldered, named]);
    expect(searchHits(fuse, 'booking')[0].record.id).toBe('named');
  });

  it('ranks an exact match above a typo match', () => {
    const exact = rec({ id: 'exact', name: 'payments' });
    const typo = rec({ id: 'typo', name: 'paymznts' });
    const fuse = createSearchIndex([typo, exact]);
    expect(searchHits(fuse, 'payments')[0].record.id).toBe('exact');
  });

  it('drops non-matching records from the result set', () => {
    const fuse = createSearchIndex([rec({ id: 'a', name: 'Get All Hotels' }), rec({ id: 'b', name: 'Booking list' })]);
    expect(ids(searchHits(fuse, 'hotel'))).toEqual(['a']);
  });
});

describe('searchHits — reported matches for highlighting', () => {
  it('reports ranges only for the fields that actually matched', () => {
    const fuse = createSearchIndex([rec({ id: 'x', name: 'Get All Payments', breadcrumb: 'Billing', url: '{{baseUrl}}/billing/payments' })]);
    const hit = searchHits(fuse, 'payments')[0];
    // "payments" is in name and url but not the breadcrumb "Billing".
    expect(hit.matches.name).toBeTruthy();
    expect(hit.matches.url).toBeTruthy();
    expect(hit.matches.breadcrumb).toBeUndefined();
  });

  it('reported ranges slice back to the query word', () => {
    const fuse = createSearchIndex([rec({ id: 'x', name: 'Get All Payments' })]);
    const hit = searchHits(fuse, 'payments')[0];
    expect(matchedText(hit.record.name, hit.matches.name)).toContain('Payments');
  });
});

describe('searchHits — transposition typos (adjacent letter swap)', () => {
  it('matches a single adjacent swap on a short word the raw threshold misses', () => {
    const fuse = createSearchIndex([rec({ id: 'hotels', name: 'Get All Hotels', url: '{{baseUrl}}/hotels' })]);
    expect(ids(searchHits(fuse, 'hotles'))).toContain('hotels'); // hotels -> l/e swapped
    expect(ids(searchHits(fuse, 'htoels'))).toContain('hotels'); // hotels -> o/t swapped
  });

  it('improves the rank of a typo that contains a transposition', () => {
    const fuse = createSearchIndex(BILLING);
    expect(searchHits(fuse, 'paymnet')[0].record.id).toBe('payments');
  });

  it('swap variants do not introduce unrelated records (near-exact gate)', () => {
    const fuse = createSearchIndex(BILLING);
    // Scrambling "cursor" must not back-door "currencies" in via a variant.
    expect(ids(searchHits(fuse, 'cursor'))).not.toContain('currencies');
    expect(searchHits(fuse, 'zzzzz')).toEqual([]);
  });
});

describe('searchHits — abbreviations are intentionally out of scope', () => {
  // Bitap only matches contiguous approximate spans, never a gapped subsequence
  // like a consonant-skeleton abbreviation. Supporting those would need a much
  // looser threshold that reopens the prefix-bleed false positives above, so it
  // is deliberately left unsupported. These guard that boundary: if the matcher
  // ever starts accepting abbreviations, precision has almost certainly slipped.
  it('does not match a consonant-skeleton abbreviation', () => {
    const hotels = createSearchIndex([rec({ id: 'h', name: 'Get All Hotels', url: '{{baseUrl}}/api/v1/hotels' })]);
    expect(ids(searchHits(hotels, 'htl'))).not.toContain('h'); // htl -> hotel
    const fuse = createSearchIndex(BILLING);
    expect(ids(searchHits(fuse, 'pmts'))).not.toContain('payments'); // pmts -> payments
  });
});
