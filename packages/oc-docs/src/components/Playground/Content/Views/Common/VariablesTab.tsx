import React from 'react';
import type { Variable } from '@opencollection/types/common/variables';
import KeyValueTable, { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';
import { unwrapVariableValue } from '../../../../../utils/variableResolution';
import { getVariableTypeLabel } from '../../../../../utils/request';

interface VariablesTabProps {
  variables: Array<{ name?: string; value?: any; disabled?: boolean }>;
  onVariablesChange: (variables: KeyValueRow[]) => void;
  title?: string;
  description?: string;
}

const dataTypeColumn = {
  key: 'type',
  label: 'Data Type',
  render: (row: KeyValueRow) => row.dataType || null
};

export const VariablesTab: React.FC<VariablesTabProps> = ({
  variables,
  onVariablesChange,
  title = 'Variables',
  description
}) => {
  const variablesData: KeyValueRow[] = (variables || []).map((variable, index) => ({
    id: `variable-${index}`,
    name: variable.name || '',
    value: unwrapVariableValue(variable.value),
    dataType: getVariableTypeLabel(variable as Variable),
    enabled: !variable.disabled
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
        data={variablesData}
        onChange={onVariablesChange}
        keyPlaceholder="Variable name"
        valuePlaceholder="Variable value"
        showEnabled={true}
        additionalColumns={[dataTypeColumn]}
      />
    </div>
  );
};

export default VariablesTab;
