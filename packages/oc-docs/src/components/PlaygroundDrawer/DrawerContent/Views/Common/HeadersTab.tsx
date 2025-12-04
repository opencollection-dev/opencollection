import React from 'react';
import KeyValueTable, { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';

interface HeadersTabProps {
  headers: Array<{ name?: string; value?: string; disabled?: boolean }>;
  onHeadersChange: (headers: KeyValueRow[]) => void;
  title?: string;
  description?: string;
}

export const HeadersTab: React.FC<HeadersTabProps> = ({
  headers,
  onHeadersChange,
  title = "Headers",
  description
}) => {
  const headersData: KeyValueRow[] = (headers || []).map((header, index) => ({
    id: `header-${index}`,
    name: header.name || '',
    value: header.value || '',
    enabled: !header.disabled
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        {description && (
          <span className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </span>
        )}
      </div>
      <KeyValueTable
        data={headersData}
        onChange={onHeadersChange}
        keyPlaceholder="Header name"
        valuePlaceholder="Header value"
        showEnabled={true}
      />
    </div>
  );
};

export default HeadersTab;
