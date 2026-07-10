import { describe, it, expect } from 'vitest';
import { parseBulkKeyValue, serializeBulkKeyValue } from './bulkKeyValue';

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
