import React, { useMemo } from 'react';
import EditableTable, { type EditableTableColumn, type EditableTableRow } from '../../../../../ui/EditableTable';
import HighlightedInput from '../../../../../ui/HighlightedInput/HighlightedInput';

interface HeaderRow extends EditableTableRow {
  name: string;
  value: string;
  enabled: boolean;
}

interface HeadersTabProps {
  headers: Array<{ name?: string; value?: string; disabled?: boolean; uid?: string }>;
  onHeadersChange: (headers: HeaderRow[]) => void;
  title?: string;
  description?: string;
}

const generateUid = () => `header_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const HeadersTab: React.FC<HeadersTabProps> = ({
  headers,
  onHeadersChange,
  title = "Headers",
  description
}) => {
  const headersData: HeaderRow[] = useMemo(() => {
    return (headers || []).map((header) => ({
      uid: (header as any).uid || generateUid(),
      name: header.name || '',
      value: header.value || '',
      enabled: !header.disabled
    }));
  }, [headers]);

  const columns: EditableTableColumn<HeaderRow>[] = useMemo(() => [
    {
      key: 'name',
      name: 'Name',
      isKeyField: true,
      placeholder: 'Header name',
      width: '35%'
    },
    {
      key: 'value',
      name: 'Value',
      placeholder: 'Header value',
      render: ({ row, value, isLastEmptyRow, onChange }) => (
        <HighlightedInput
          value={value}
          onChange={onChange}
          placeholder={isLastEmptyRow ? 'Header value' : ''}
        />
      )
    }
  ], []);

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
      <EditableTable
        columns={columns}
        rows={headersData}
        onChange={onHeadersChange}
        defaultRow={{ name: '', value: '', enabled: true }}
        showCheckbox={true}
        showDelete={true}
        checkboxKey="enabled"
      />
    </div>
  );
};

export default HeadersTab;
