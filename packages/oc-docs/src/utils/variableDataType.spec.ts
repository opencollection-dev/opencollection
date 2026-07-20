import { describe, it, expect } from 'vitest';
import { parseValueByDataType, validateDataTypeValue, rowToVariable } from './variableDataType';

describe('parseValueByDataType', () => {
  it('leaves string / untyped values unchanged', () => {
    expect(parseValueByDataType('hello', 'string')).toBe('hello');
    expect(parseValueByDataType('hello', undefined)).toBe('hello');
  });

  it('coerces a numeric string to a number, raw on failure', () => {
    expect(parseValueByDataType('42', 'number')).toBe(42);
    expect(parseValueByDataType('abc', 'number')).toBe('abc');
  });

  it('coerces boolean literals', () => {
    expect(parseValueByDataType('true', 'boolean')).toBe(true);
    expect(parseValueByDataType('false', 'boolean')).toBe(false);
    expect(parseValueByDataType('nope', 'boolean')).toBe('nope');
  });

  it('coerces a JSON object, raw on invalid JSON', () => {
    expect(parseValueByDataType('{"a":1}', 'object')).toEqual({ a: 1 });
    expect(parseValueByDataType('{bad', 'object')).toBe('{bad');
  });
});

describe('validateDataTypeValue', () => {
  it('returns null for string or well-typed values', () => {
    expect(validateDataTypeValue('x', 'string')).toBeNull();
    expect(validateDataTypeValue(42, 'number')).toBeNull();
    expect(validateDataTypeValue(true, 'boolean')).toBeNull();
    expect(validateDataTypeValue({ a: 1 }, 'object')).toBeNull();
  });

  it('returns an error when the coerced value type mismatches', () => {
    expect(validateDataTypeValue('abc', 'number')).toContain('number');
    expect(validateDataTypeValue('nope', 'boolean')).toContain('boolean');
    expect(validateDataTypeValue('{bad', 'object')).toContain('object');
  });

  it('flags an empty value under a non-string type (matches Bruno) but never an unset value', () => {
    expect(validateDataTypeValue('', 'number')).toContain('number');
    expect(validateDataTypeValue('', 'boolean')).toContain('boolean');
    expect(validateDataTypeValue('', 'object')).toContain('object');
    expect(validateDataTypeValue('', 'string')).toBeNull();
    expect(validateDataTypeValue(undefined, 'number')).toBeNull();
    expect(validateDataTypeValue(null, 'number')).toBeNull();
  });
});

describe('rowToVariable', () => {
  it('stores a string value as a plain string', () => {
    expect(rowToVariable({ name: 'a', value: 'v', enabled: true })).toEqual({ name: 'a', value: 'v', disabled: false });
  });

  it('stores a non-string type as a {type,data} value', () => {
    expect(rowToVariable({ name: 'n', value: '42', enabled: true, dataType: 'number' })).toEqual({
      name: 'n',
      value: { type: 'number', data: '42' },
      disabled: false
    });
  });

  it('preserves description and reflects disabled', () => {
    expect(rowToVariable({ name: 'a', value: 'v', enabled: false, description: 'd' })).toEqual({
      name: 'a',
      value: 'v',
      disabled: true,
      description: 'd'
    });
  });

  it('keeps an unsupported-type value verbatim when the display value is unchanged (a sibling-row edit must not flatten it)', () => {
    const original = { type: 'null', data: '' } as never;
    expect(rowToVariable({ name: 'x', value: '', enabled: true, dataType: 'string', originalValue: original })).toEqual({
      name: 'x',
      value: original,
      disabled: false
    });
  });

  it('converts an unsupported-type value to a plain string only when its value is actually edited', () => {
    const original = { type: 'null', data: '' } as never;
    expect(
      rowToVariable({ name: 'x', value: 'edited', enabled: true, dataType: 'string', originalValue: original })
    ).toEqual({ name: 'x', value: 'edited', disabled: false });
  });
});
