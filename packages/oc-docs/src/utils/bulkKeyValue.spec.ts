import { describe, it, expect } from 'vitest';
import type { KeyValueRow } from '../components/KeyValueTable/KeyValueTable';
import { parseBulkKeyValue, preserveDescriptions, serializeBulkKeyValue } from './bulkKeyValue';

describe('parseBulkKeyValue', () => {
  it('parses `name: value` lines and trims whitespace', () => {
    expect(parseBulkKeyValue('  Accept :  application/json ')).toEqual([
      { name: 'Accept', value: 'application/json', enabled: true }
    ]);
  });

  it('treats a leading `//` as disabled', () => {
    expect(parseBulkKeyValue('// X-Debug: true')).toEqual([
      { name: 'X-Debug', value: 'true', enabled: false }
    ]);
  });

  it('ignores lines without a `:` separator', () => {
    expect(parseBulkKeyValue('valid: 1\nnope\n\nalso-valid: 2')).toEqual([
      { name: 'valid', value: '1', enabled: true },
      { name: 'also-valid', value: '2', enabled: true }
    ]);
  });

  it('keeps colons that appear in the value', () => {
    expect(parseBulkKeyValue('Authorization: Bearer a:b:c')).toEqual([
      { name: 'Authorization', value: 'Bearer a:b:c', enabled: true }
    ]);
  });

  it('handles CRLF line endings', () => {
    expect(parseBulkKeyValue('a: 1\r\nb: 2')).toEqual([
      { name: 'a', value: '1', enabled: true },
      { name: 'b', value: '2', enabled: true }
    ]);
  });
});

describe('serializeBulkKeyValue', () => {
  it('serializes enabled and disabled rows', () => {
    expect(
      serializeBulkKeyValue([
        { name: 'a', value: '1', enabled: true },
        { name: 'b', value: '2', enabled: false }
      ])
    ).toBe('a:1\n//b:2');
  });
});

describe('round-trip', () => {
  it('parse -> serialize -> parse is stable', () => {
    const rows = [
      { name: 'Accept', value: 'application/json', enabled: true },
      { name: 'X-Debug', value: 'true', enabled: false }
    ];
    expect(parseBulkKeyValue(serializeBulkKeyValue(rows))).toEqual(rows);
  });
});

describe('preserveDescriptions', () => {
  const original: KeyValueRow[] = [
    { id: 'h-0', name: 'Accept', value: 'application/json', enabled: true, description: 'media type' },
    { id: 'h-1', name: 'Authorization', value: 'Bearer x', enabled: true, description: 'the token' }
  ];

  it('re-attaches a description to the matching name', () => {
    const rows = preserveDescriptions(parseBulkKeyValue('Accept:application/json\nAuthorization:Bearer x'), original, 'h');
    expect(rows[0]).toMatchObject({ name: 'Accept', description: 'media type' });
    expect(rows[1]).toMatchObject({ name: 'Authorization', description: 'the token' });
  });

  it('preserves descriptions when the rows are reordered', () => {
    const rows = preserveDescriptions(parseBulkKeyValue('Authorization:Bearer x\nAccept:application/json'), original, 'h');
    expect(rows[0]).toMatchObject({ name: 'Authorization', description: 'the token' });
    expect(rows[1]).toMatchObject({ name: 'Accept', description: 'media type' });
  });

  it('drops the description when a key is renamed', () => {
    const rows = preserveDescriptions(parseBulkKeyValue('Accepts:application/json'), original, 'h');
    expect(rows[0]).not.toHaveProperty('description');
  });

  it('gives a brand-new entry no description', () => {
    const rows = preserveDescriptions(parseBulkKeyValue('X-New:1'), original, 'h');
    expect(rows[0]).not.toHaveProperty('description');
  });

  it('matches duplicate names by closest index and consumes each original once', () => {
    const dupes: KeyValueRow[] = [
      { id: 'd-0', name: 'X', value: 'a', enabled: true, description: 'first' },
      { id: 'd-1', name: 'X', value: 'b', enabled: true, description: 'second' }
    ];
    const rows = preserveDescriptions(parseBulkKeyValue('X:a\nX:b\nX:c'), dupes, 'd');
    expect(rows[0]).toMatchObject({ description: 'first' });
    expect(rows[1]).toMatchObject({ description: 'second' });
    expect(rows[2]).not.toHaveProperty('description');
  });

  it('does not attach an empty description and never mutates the snapshot', () => {
    const withEmpty: KeyValueRow[] = [{ id: 'e-0', name: 'A', value: '1', enabled: true, description: '' }];
    const snapshot = JSON.stringify(withEmpty);
    const rows = preserveDescriptions(parseBulkKeyValue('A:1'), withEmpty, 'e');
    expect(rows[0]).not.toHaveProperty('description');
    expect(JSON.stringify(withEmpty)).toBe(snapshot);
  });
});
