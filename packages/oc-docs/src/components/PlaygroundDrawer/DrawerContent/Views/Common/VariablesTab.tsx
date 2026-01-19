import React, { useMemo } from 'react';
import EditableTable, { type EditableTableColumn, type EditableTableRow } from '../../../../../ui/EditableTable';

interface VariableRow extends EditableTableRow {
  name: string;
  value: string;
  enabled: boolean;
}

interface VariablesTabProps {
  variables: Array<{ name?: string; value?: any; disabled?: boolean; uid?: string }>;
  onVariablesChange: (variables: VariableRow[]) => void;
  title?: string;
  description?: string;
}

const generateUid = () => `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const VariablesTab: React.FC<VariablesTabProps> = ({
  variables,
  onVariablesChange,
  title = "Variables",
  description
}) => {
  const variablesData: VariableRow[] = useMemo(() => {
    return (variables || []).map((variable) => ({
      uid: (variable as any).uid || generateUid(),
      name: variable.name || '',
      value: typeof variable.value === 'string' ? variable.value : '',
      enabled: !variable.disabled
    }));
  }, [variables]);

  const columns: EditableTableColumn<VariableRow>[] = useMemo(() => [
    {
      key: 'name',
      name: 'Name',
      isKeyField: true,
      placeholder: 'Variable name',
      width: '35%'
    },
    {
      key: 'value',
      name: 'Value',
      placeholder: 'Variable value'
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
        rows={variablesData}
        onChange={onVariablesChange}
        defaultRow={{ name: '', value: '', enabled: true }}
        showCheckbox={true}
        showDelete={true}
        checkboxKey="enabled"
      />
    </div>
  );
};

export default VariablesTab;
