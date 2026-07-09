import React, { useCallback, useState } from 'react';
import KeyValueTable, { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';
import BulkEdit from './BulkEdit';

interface HeadersTabProps {
  headers: Array<{ name?: string; value?: string; disabled?: boolean }>;
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
    enabled: !header.disabled
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
        />
      ) : (
        <BulkEdit data={headersData} onChange={onHeadersChange} idPrefix="header" />
      )}
      <div className="flex justify-end mt-2">
        <button
          className="text-link select-none"
          data-testid="bulk-edit-toggle"
          style={{ color: 'var(--oc-text-link)', cursor: 'pointer' }}
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
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        {Boolean(title) && (
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </span>
        )}
        {description && (
          <span className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </span>
        )}
      </div>
      <HeadersDisplay headers={headers} onHeadersChange={onHeadersChange} />
    </div>
  );
};

export default HeadersTab;
