import { describe, it, expect } from 'vitest';
import { withTrailingBlank, committableRows, applyRowPatch, removeRowAt } from './useEditableRows';
import type { KeyValueRow } from '../components/KeyValueTable/KeyValueTable';

const row = (over: Partial<KeyValueRow>): KeyValueRow => ({ id: 'x', name: '', value: '', enabled: true, ...over });
const names = (rows: KeyValueRow[]) => rows.map((r) => r.name);

describe('withTrailingBlank', () => {
  it('appends one blank row to type into', () => {
    const out = withTrailingBlank([row({ name: 'a', value: '1' })], false);
    expect(names(out)).toEqual(['a', '']);
  });

  it('does not append when the last row is already blank', () => {
    const out = withTrailingBlank([row({ name: 'a' }), row({ name: '' })], false);
    expect(names(out)).toEqual(['a', '']);
  });

  it('appends nothing when disableNewRow is true', () => {
    expect(withTrailingBlank([row({ name: 'a' })], true)).toHaveLength(1);
  });

  it('seeds the trailing blank via makeNewRow (e.g. secret)', () => {
    const out = withTrailingBlank([], false, () => ({ secret: true }));
    expect(out).toHaveLength(1);
    expect(out[0].secret).toBe(true);
  });
});

describe('committableRows', () => {
  it('drops blank (unnamed) rows', () => {
    const out = committableRows([row({ name: 'a' }), row({ name: '  ' }), row({ name: 'b' })]);
    expect(names(out)).toEqual(['a', 'b']);
  });
});

describe('applyRowPatch', () => {
  it('appends a fresh blank when a name is typed into the trailing blank', () => {
    const rows = [row({ name: 'a' }), row({ name: '' })];
    const out = applyRowPatch(rows, 1, { name: 'b' }, false);
    expect(names(out)).toEqual(['a', 'b', '']);
  });

  it('does not append when editing an existing named row', () => {
    const rows = [row({ name: 'a' }), row({ name: '' })];
    const out = applyRowPatch(rows, 0, { value: '9' }, false);
    expect(names(out)).toEqual(['a', '']);
  });

  it('does not append when disableNewRow is true', () => {
    const rows = [row({ name: '' })];
    expect(applyRowPatch(rows, 0, { name: 'a' }, true)).toHaveLength(1);
  });

  it('uses makeNewRow for the appended blank', () => {
    const rows = [row({ name: '', secret: true })];
    const out = applyRowPatch(rows, 0, { name: 'tok' }, false, () => ({ secret: true }));
    expect(out[1].secret).toBe(true);
  });
});

describe('addWhenComplete mode', () => {
  it('withTrailingBlank appends only after the last row has both name and value', () => {
    expect(names(withTrailingBlank([row({ name: 'a', value: '1' })], false, undefined, true))).toEqual(['a', '']);
    expect(names(withTrailingBlank([row({ name: 'a', value: '' })], false, undefined, true))).toEqual(['a']);
  });

  it('applyRowPatch does not spawn a new row until the trailing row is complete', () => {
    const rows = [row({ name: 'a', value: '1' }), row({ name: '' })];
    const named = applyRowPatch(rows, 1, { name: 'b' }, false, undefined, true);
    expect(names(named)).toEqual(['a', 'b']);
    const completed = applyRowPatch(named, 1, { value: '2' }, false, undefined, true);
    expect(names(completed)).toEqual(['a', 'b', '']);
  });

  it('removeRowAt keeps the trailing blank only when the last remaining row is complete', () => {
    const rows = [row({ name: 'a', value: '1' }), row({ name: 'b', value: '2' }), row({ name: '' })];
    expect(names(removeRowAt(rows, 0, false, undefined, true))).toEqual(['b', '']);
    const incomplete = [row({ name: 'a', value: '' }), row({ name: 'b', value: '2' })];
    expect(names(removeRowAt(incomplete, 1, false, undefined, true))).toEqual(['a']);
  });
});

describe('removeRowAt', () => {
  it('removes a named row and keeps a trailing blank', () => {
    const rows = [row({ name: 'a' }), row({ name: 'b' }), row({ name: '' })];
    const out = removeRowAt(rows, 0, false);
    expect(names(out)).toEqual(['b', '']);
  });

  it('ignores a request to remove the trailing blank', () => {
    const rows = [row({ name: 'a' }), row({ name: '' })];
    expect(removeRowAt(rows, 1, false)).toBe(rows);
  });

  it('re-adds a trailing blank when the last remaining row is named', () => {
    const rows = [row({ name: 'a' }), row({ name: 'b' })];
    const out = removeRowAt(rows, 0, false);
    expect(names(out)).toEqual(['b', '']);
  });
});
