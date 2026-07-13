import React, { useCallback, useState } from 'react';
import KeyValueTable, { type KeyValueRow } from '../../../../../../components/KeyValueTable/KeyValueTable';
import { STANDARD_HTTP_HEADERS, MIME_TYPES } from '../../../../../../constants/httpHeaders';
import BulkEdit from '../BulkEdit/BulkEdit';
import { StyledWrapper } from './StyledWrapper';

interface HeadersTabProps {
  headers: Array<{ name?: string; value?: string; disabled?: boolean; description?: unknown }>;
  onHeadersChange: (headers: KeyValueRow[]) => void;
  title?: string;
  description?: string;
}

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
        {Boolean(title) && <span className="title text-sm font-semibold">{title}</span>}
        {description && <span className="description text-xs leading-tight">{description}</span>}
      </div>
      <HeadersDisplay headers={headers} onHeadersChange={onHeadersChange} />
    </StyledWrapper>
  );
};

export default HeadersTab;
