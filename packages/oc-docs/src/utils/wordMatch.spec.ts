import { describe, it, expect } from 'vitest';
import { wordMatchQuality } from './wordMatch';

describe('wordMatchQuality', () => {
  it('empty query scores 0 (matches anything)', () => {
    expect(wordMatchQuality('', 'anything')).toBe(0);
  });

  it('empty text never matches a non-empty query', () => {
    expect(wordMatchQuality('a', '')).toBeNull();
  });

  it('matches a whole word', () => {
    expect(wordMatchQuality('customer', 'Customer')).not.toBeNull();
  });

  it('matches a word prefix', () => {
    expect(wordMatchQuality('customer', 'Get All Customers')).not.toBeNull();
    expect(wordMatchQuality('cursor', 'uses cursor-based pagination')).not.toBeNull();
  });

  it('matches a multi-word phrase that begins at a word boundary', () => {
    expect(wordMatchQuality('get all', 'Get All Hotels')).not.toBeNull();
  });

  it('is case-insensitive', () => {
    expect(wordMatchQuality('CURSOR', 'cursor-based')).not.toBeNull();
    expect(wordMatchQuality('cursor', 'CURSOR-BASED')).not.toBeNull();
  });

  it('rejects a fragment inside a longer word', () => {
    expect(wordMatchQuality('get', 'delivered together')).toBeNull();
    expect(wordMatchQuality('ustomer', 'Customer')).toBeNull();
  });

  it('rejects a scattered subsequence (the reported "curs" -> "Customers" bug)', () => {
    expect(wordMatchQuality('curs', 'Customers')).toBeNull();
  });

  it('anchors after url and query-string separators', () => {
    expect(wordMatchQuality('v1', '{{baseUrl}}/api/v1/hotels')).not.toBeNull(); // after "/"
    expect(wordMatchQuality('status', '/invoices?status=open')).not.toBeNull(); // after "?"
    expect(wordMatchQuality('open', '/invoices?status=open')).not.toBeNull(); // after "="
  });

  it('ranks an earlier hit at least as high as a later one', () => {
    const early = wordMatchQuality('hotel', 'hotel reservations')!;
    const late = wordMatchQuality('hotel', 'book a very nice hotel somewhere far away')!;
    expect(early).toBeGreaterThanOrEqual(late);
  });
});
