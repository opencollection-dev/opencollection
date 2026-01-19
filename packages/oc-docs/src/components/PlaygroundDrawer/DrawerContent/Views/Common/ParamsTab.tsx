import React, { useMemo } from 'react';
import EditableTable, { type EditableTableColumn, type EditableTableRow } from '../../../../../ui/EditableTable';
import HighlightedInput from '../../../../../ui/HighlightedInput/HighlightedInput';

interface ParamRow extends EditableTableRow {
  name: string;
  value: string;
  enabled: boolean;
  type: string;
}

interface ParamsTabProps {
  params: Array<{ name?: string; value?: string; disabled?: boolean; type?: string; uid?: string }>;
  onParamsChange: (params: ParamRow[]) => void;
  title?: string;
  description?: string;
}

const generateUid = () => `param_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const ParamsTab: React.FC<ParamsTabProps> = ({
  params,
  onParamsChange,
  title = "Query Parameters",
  description
}) => {
  const paramsData: ParamRow[] = useMemo(() => {
    return (params || []).map((param) => ({
      uid: (param as any).uid || generateUid(),
      name: param.name || '',
      value: param.value || '',
      enabled: !param.disabled,
      type: param.type || 'query'
    }));
  }, [params]);

  const columns: EditableTableColumn<ParamRow>[] = useMemo(() => [
    {
      key: 'name',
      name: 'Key',
      isKeyField: true,
      placeholder: 'Key',
      width: '35%'
    },
    {
      key: 'value',
      name: 'Value',
      placeholder: 'Value',
      render: ({ row, value, isLastEmptyRow, onChange }) => (
        <HighlightedInput
          value={value}
          onChange={onChange}
          placeholder={isLastEmptyRow ? 'Value' : ''}
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
        rows={paramsData}
        onChange={onParamsChange}
        defaultRow={{ name: '', value: '', enabled: true, type: 'query' }}
        showCheckbox={true}
        showDelete={true}
        checkboxKey="enabled"
      />
    </div>
  );
};

export default ParamsTab;
