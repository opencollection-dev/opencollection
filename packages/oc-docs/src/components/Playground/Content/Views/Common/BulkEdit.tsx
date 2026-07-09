import React, { useMemo } from 'react';
import CodeEditor from '../../../../../ui/CodeEditor/CodeEditor';
import type { KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';
import { parseBulkKeyValue, serializeBulkKeyValue } from '../../../../../utils/bulkKeyValue';

export interface BulkEditProps {
  data: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
  idPrefix?: string;
}

// Bulk editor for key/value rows: `name: value` lines, `//` disables a row.
const BulkEdit: React.FC<BulkEditProps> = ({ data, onChange, idPrefix = 'bulk' }) => {
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
      <CodeEditor value={text} onChange={handleChange} language="plaintext" height="200px" placeholder="name: value" />
    </div>
  );
};

export default BulkEdit;
