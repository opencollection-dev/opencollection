import type { KeyValueRow } from '../components/KeyValueTable/KeyValueTable';

export interface KeyValueEntry {
  name: string;
  value: string;
  disabled: boolean;
  description?: string;
}

/**
 * Map an editable KeyValueTable row back to its stored entry: `enabled` inverts to `disabled`, and a
 * description is written only when it is a non-empty string — clearing the cell drops it, matching
 * how the app stores a bare description string and omits blanks. Callers add any entry-specific
 * fields (e.g. a query param's `type`) around the result.
 */
export const keyValueRowToEntry = (row: KeyValueRow): KeyValueEntry => ({
  name: row.name,
  value: row.value,
  disabled: !row.enabled,
  ...(row.description ? { description: String(row.description) } : {})
});
