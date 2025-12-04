import React from 'react';
import KeyValueTable, { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';

interface ParamsTabProps {
  params: Array<{ name?: string; value?: string; disabled?: boolean; type?: string }>;
  onParamsChange: (params: KeyValueRow[]) => void;
  title?: string;
  description?: string;
}

export const ParamsTab: React.FC<ParamsTabProps> = ({
  params,
  onParamsChange,
  title = "Query Parameters",
  description
}) => {
  const paramsData: KeyValueRow[] = (params || []).map((param, index) => ({
    id: `param-${index}`,
    name: param.name || '',
    value: param.value || '',
    enabled: !param.disabled,
    type: param.type || 'query'
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
        data={paramsData}
        onChange={onParamsChange}
        keyPlaceholder="Key"
        valuePlaceholder="Value"
        showEnabled={true}
      />
    </div>
  );
};

export default ParamsTab;
