import React, { useState } from 'react';
import CodeEditor from '../../../../../../ui/CodeEditor/CodeEditor';
import type { KeyValueRow } from '../../../../../../ui/KeyValueTable/KeyValueTable';
import { parseBulkKeyValue, serializeBulkKeyValue } from '../../../../../../utils/bulkKeyValue';
import { StyledWrapper } from './StyledWrapper';

export interface BulkEditProps {
  data: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
  onToggle: () => void;
  idPrefix?: string;
}

const BulkEdit: React.FC<BulkEditProps> = ({ data, onChange, idPrefix = 'bulk' }) => {
  const [text, setText] = useState(() => serializeBulkKeyValue(data));

  const handleChange = (value: string) => {
    setText(value);
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
    <StyledWrapper className="space-y-3">
      <CodeEditor value={text} onChange={handleChange} language="plaintext" height="200px" />
    </StyledWrapper>
  );
};

export default BulkEdit;
