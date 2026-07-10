import React, { useEffect, useRef, useState } from 'react';
import CodeEditor from '../../../../../../ui/CodeEditor/CodeEditor';
import type { KeyValueRow } from '../../../../../../ui/KeyValueTable/KeyValueTable';
import { parseBulkKeyValue, serializeBulkKeyValue } from '../../../../../../utils/bulkKeyValue';
import { StyledWrapper } from './StyledWrapper';

export interface BulkEditProps {
  data: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
  idPrefix?: string;
}

const BulkEdit: React.FC<BulkEditProps> = ({ data, onChange, idPrefix = 'bulk' }) => {
  const [text, setText] = useState(() => serializeBulkKeyValue(data));
  const lastSynced = useRef(text);
  const incoming = serializeBulkKeyValue(data);

  useEffect(() => {
    if (incoming !== lastSynced.current) {
      lastSynced.current = incoming;
      setText(incoming);
    }
  }, [incoming]);

  const handleChange = (value: string) => {
    setText(value);
    const rows = parseBulkKeyValue(value).map((item, index) => ({
      id: `${idPrefix}-${index}`,
      name: item.name,
      value: item.value,
      enabled: item.enabled
    }));
    lastSynced.current = serializeBulkKeyValue(rows);
    onChange(rows);
  };

  return (
    <StyledWrapper className="space-y-3">
      <CodeEditor value={text} onChange={handleChange} language="plaintext" height="200px" placeholder="name: value" />
    </StyledWrapper>
  );
};

export default BulkEdit;
