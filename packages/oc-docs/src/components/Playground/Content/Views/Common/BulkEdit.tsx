import React, { useMemo } from 'react';
import CodeEditor from '../../../../../ui/CodeEditor/CodeEditor';
import type { KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';
import { parseBulkKeyValue, serializeBulkKeyValue } from '../../../../../utils/bulkKeyValue';

export interface BulkEditProps {
  /** Current rows, shown serialized as `name: value` lines. */
  data: KeyValueRow[];
  /** Called with the re-parsed rows whenever the text changes. */
  onChange: (rows: KeyValueRow[]) => void;
  /** Switch back to the key/value table view. */
  onToggle: () => void;
  /** Prefix used to generate row ids. */
  idPrefix?: string;
}

/**
 * Bulk editor for key/value rows (headers, params, etc.). Ported from
 * bruno-app's BulkEditor: text lines of `name: value`, with `//` disabling a row.
 */
const BulkEdit: React.FC<BulkEditProps> = ({ data, onChange, onToggle, idPrefix = 'bulk' }) => {
  const text = useMemo(() => serializeBulkKeyValue(data), [data]);

  const handleChange = (value: string) => {
    const parsed = parseBulkKeyValue(value);
    onChange(
      parsed.map((item, index) => ({
        id: `${idPrefix}-${index}`,
        name: item.name,
        value: item.value,
        enabled: item.enabled
      }))
    );
  };

  return (
    <div className="space-y-3">
      <CodeEditor value={text} onChange={handleChange} language="plaintext" height="200px" />
    </div>
  );
};

export default BulkEdit;
