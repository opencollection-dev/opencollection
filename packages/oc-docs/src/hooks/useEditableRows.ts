import { useState, useEffect, useRef, useCallback } from 'react';
import type { KeyValueRow } from '../components/KeyValueTable/KeyValueTable';

type NewRow = () => Partial<KeyValueRow>;

const generateId = () => `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const blankRow = (makeNewRow?: NewRow): KeyValueRow => ({
  id: generateId(),
  name: '',
  value: '',
  enabled: true,
  ...makeNewRow?.()
});

const isBlank = (row?: KeyValueRow): boolean => !row?.name || row.name.trim() === '';
const isComplete = (row?: KeyValueRow): boolean => !isBlank(row) && (row?.value ?? '').trim() !== '';

// Whether the last row already serves as the trailing "type here" row, so we
// don't append another. In addWhenComplete mode the trailing row lasts until it
// has both a name and a value; otherwise until it has a name.
const hasTrailing = (last: KeyValueRow | undefined, addWhenComplete: boolean): boolean =>
  addWhenComplete ? !isComplete(last) : isBlank(last);

export const withTrailingBlank = (
  data: KeyValueRow[],
  disableNewRow: boolean,
  makeNewRow?: NewRow,
  addWhenComplete = false
): KeyValueRow[] => {
  const rows = data.map((row, idx) => ({ ...row, id: row.id || `row-${idx}` }));
  if (disableNewRow || (rows.length > 0 && hasTrailing(rows[rows.length - 1], addWhenComplete))) return rows;
  return [...rows, blankRow(makeNewRow)];
};

export const committableRows = (rows: KeyValueRow[]): KeyValueRow[] => rows.filter((row) => !isBlank(row));

export const applyRowPatch = (
  rows: KeyValueRow[],
  index: number,
  patch: Partial<KeyValueRow>,
  disableNewRow: boolean,
  makeNewRow?: NewRow,
  addWhenComplete = false
): KeyValueRow[] => {
  const next = [...rows];
  const wasBlank = isBlank(next[index]);
  next[index] = { ...next[index], ...patch };
  const spawn = addWhenComplete ? isComplete(next[index]) : wasBlank && !isBlank(next[index]);
  if (!disableNewRow && index === rows.length - 1 && spawn) {
    next.push(blankRow(makeNewRow));
  }
  return next;
};

export const removeRowAt = (
  rows: KeyValueRow[],
  index: number,
  disableNewRow: boolean,
  makeNewRow?: NewRow,
  addWhenComplete = false
): KeyValueRow[] => {
  if (index === rows.length - 1 && isBlank(rows[index])) return rows;
  const next = rows.filter((_, i) => i !== index);
  if (!disableNewRow && (next.length === 0 || !hasTrailing(next[next.length - 1], addWhenComplete))) {
    next.push(blankRow(makeNewRow));
  }
  return next;
};

interface UseEditableRowsOptions {
  disableNewRow?: boolean;
  makeNewRow?: NewRow;
  addWhenComplete?: boolean;
}

export const useEditableRows = (
  data: KeyValueRow[],
  onChange: (rows: KeyValueRow[]) => void,
  { disableNewRow = false, makeNewRow, addWhenComplete = false }: UseEditableRowsOptions = {}
) => {
  const isEditingRef = useRef(false);
  const previousDataRef = useRef('');
  const makeNewRowRef = useRef(makeNewRow);
  makeNewRowRef.current = makeNewRow;

  const [rows, setRows] = useState<KeyValueRow[]>(() =>
    withTrailingBlank(data, disableNewRow, makeNewRowRef.current, addWhenComplete)
  );

  useEffect(() => {
    if (isEditingRef.current) return;
    const dataString = JSON.stringify(data);
    if (dataString === previousDataRef.current) return;
    previousDataRef.current = dataString;
    setRows(withTrailingBlank(data, disableNewRow, makeNewRowRef.current, addWhenComplete));
  }, [data, disableNewRow, addWhenComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      isEditingRef.current = false;
    }, 300);
    return () => clearTimeout(timer);
  }, [rows]);

  const commit = useCallback(
    (next: KeyValueRow[]) => {
      setRows(next);
      onChange(committableRows(next));
    },
    [onChange]
  );

  const updateRow = useCallback(
    (index: number, patch: Partial<KeyValueRow>) => {
      isEditingRef.current = true;
      commit(applyRowPatch(rows, index, patch, disableNewRow, makeNewRowRef.current, addWhenComplete));
    },
    [rows, disableNewRow, addWhenComplete, commit]
  );

  const updateField = useCallback(
    (index: number, field: string, value: unknown) => updateRow(index, { [field]: value } as Partial<KeyValueRow>),
    [updateRow]
  );

  const removeRow = useCallback(
    (index: number) => {
      isEditingRef.current = true;
      commit(removeRowAt(rows, index, disableNewRow, makeNewRowRef.current, addWhenComplete));
    },
    [rows, disableNewRow, addWhenComplete, commit]
  );

  return { rows, updateRow, updateField, removeRow };
};

export default useEditableRows;
