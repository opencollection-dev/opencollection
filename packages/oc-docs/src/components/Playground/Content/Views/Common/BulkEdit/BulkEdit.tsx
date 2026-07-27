import React, { useRef, useState } from 'react';
import CodeEditor from '../../../../../../ui/CodeEditor/CodeEditor';
import type { KeyValueRow } from '../../../../../../components/KeyValueTable/KeyValueTable';
import { parseBulkKeyValue, preserveDescriptions, serializeBulkKeyValue } from '../../../../../../utils/bulkKeyValue';
import { StyledWrapper } from './StyledWrapper';

export interface BulkEditProps {
  data: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
  idPrefix?: string;
}

const BulkEdit: React.FC<BulkEditProps> = ({ data, onChange, idPrefix = 'bulk' }) => {
  // The bulk text is name/value/enabled only; descriptions merge back against the rows as they were
  // on entering bulk edit (this snapshot), so switching to bulk view and back never drops them.
  const originalRef = useRef(data);
  const [text, setText] = useState(() => serializeBulkKeyValue(data));

  const handleChange = (value: string) => {
    setText(value);
    onChange(preserveDescriptions(parseBulkKeyValue(value), originalRef.current, idPrefix));
  };

  return (
    <StyledWrapper className="space-y-3">
      <CodeEditor value={text} onChange={handleChange} language="plaintext" height="200px" placeholder="name: value" />
    </StyledWrapper>
  );
};

export default BulkEdit;
