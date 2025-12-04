import React from 'react';
import KeyValueTable, { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';

interface VariablesTabProps {
  variables: Array<{ name?: string; value?: any; disabled?: boolean }>;
  onVariablesChange: (variables: KeyValueRow[]) => void;
  title?: string;
  description?: string;
}

export const VariablesTab: React.FC<VariablesTabProps> = ({
  variables,
  onVariablesChange,
  title = "Variables",
  description
}) => {
  const variablesData: KeyValueRow[] = (variables || []).map((variable, index) => ({
    id: `variable-${index}`,
    name: variable.name || '',
    value: typeof variable.value === 'string' ? variable.value : '',
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
      />
    </div>
  );
};

export default VariablesTab;
