import React, { useCallback, useState } from 'react';
import KeyValueTable, { type KeyValueRow } from '../../../../../../components/KeyValueTable/KeyValueTable';
import { STANDARD_HTTP_HEADERS, MIME_TYPES } from '../../../../../../constants/httpHeaders';
import { HEADER_NAME_REGEX, HEADER_VALUE_REGEX } from '../../../../../../constants/regex';
import BulkEdit from '../BulkEdit/BulkEdit';
import { StyledWrapper } from './StyledWrapper';

interface HeadersTabProps {
  headers: Array<{ name?: string; value?: string; disabled?: boolean; description?: unknown }>;
  onHeadersChange: (headers: KeyValueRow[]) => void;
  title?: string;
  description?: string;
}

const getHeaderError = (row: KeyValueRow, _index: number, field: 'name' | 'value'): string | null => {
  if (field === 'name') {
    if (!row.name || row.name.trim() === '') return null;
    if (!HEADER_NAME_REGEX.test(row.name)) return 'Header name cannot contain spaces or newlines';
  }
  if (field === 'value') {
    if (!row.value) return null;
    if (!HEADER_VALUE_REGEX.test(row.value)) return 'Header value cannot contain newlines';
  }
  return null;
};

const HeadersDisplay: React.FC<Omit<HeadersTabProps, 'title' | 'description'>> = ({ headers, onHeadersChange }) => {
  const [showKeyValueTable, setShowKeyValueTable] = useState(true);
  const headersData: KeyValueRow[] = (headers || []).map((header, index) => ({
    id: `header-${index}`,
    name: header.name || '',
    value: header.value || '',
    enabled: !header.disabled,
    description: header.description
  }));

  const toggleBulkEditView = useCallback(() => {
    setShowKeyValueTable((prev) => !prev);
  }, [setShowKeyValueTable]);

  return (
    <>
      {showKeyValueTable ? (
        <KeyValueTable
          data={headersData}
          onChange={onHeadersChange}
          keyPlaceholder="Name"
          valuePlaceholder="Value"
          showEnabled={true}
          inlineActions={true}
          keyAutocomplete={STANDARD_HTTP_HEADERS}
          valueAutocomplete={MIME_TYPES}
          getRowError={getHeaderError}
        />
      ) : (
        <BulkEdit data={headersData} onChange={onHeadersChange} idPrefix="header" />
      )}
      <div className="flex justify-end mt-2">
        <button
          className="bulk-edit-toggle text-link select-none"
          data-testid="bulk-edit-toggle"
          onClick={toggleBulkEditView}
        >
          {showKeyValueTable ? 'Bulk edit' : 'Key/Value edit'}
        </button>
      </div>
    </>
  );
};

export const HeadersTab: React.FC<HeadersTabProps> = ({ headers, onHeadersChange, title = 'Headers', description }) => {
  return (
    <StyledWrapper className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        {title && <span className="title text-sm font-semibold">{title}</span>}
        {description && <span className="description text-xs leading-tight">{description}</span>}
      </div>
      <HeadersDisplay headers={headers} onHeadersChange={onHeadersChange} />
    </StyledWrapper>
  );
};

export default HeadersTab;
