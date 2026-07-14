import React from 'react';
import type { Variable } from '@opencollection/types/common/variables';
import KeyValueTable, { type KeyValueRow } from '../../../../../../ui/KeyValueTable/KeyValueTable';
import { unwrapVariableValue } from '../../../../../../utils/variableResolution';
import { getVariableTypeLabel } from '../../../../../../utils/request';
import { StyledWrapper } from './StyledWrapper';
import { dataTypeColumn } from '../../../../../../constants/dataTypeColumn';

interface VariablesTabProps {
  variables: Array<{ name?: string; value?: any; disabled?: boolean }>;
  onVariablesChange: (variables: KeyValueRow[]) => void;
  title?: string;
  description?: string;
}

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
    <StyledWrapper className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        {Boolean(title) && <span className="title text-sm font-semibold">{title}</span>}
        {Boolean(description) && <span className="description text-xs leading-tight">{description}</span>}
      </div>
      <KeyValueTable
        data={variablesData}
        onChange={onVariablesChange}
        keyPlaceholder="Name"
        valuePlaceholder="Value"
        showEnabled={true}
        additionalColumns={[dataTypeColumn]}
      />
    </StyledWrapper>
  );
};

export default VariablesTab;
