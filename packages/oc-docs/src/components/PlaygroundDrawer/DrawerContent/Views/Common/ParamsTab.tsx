import React, { useCallback, useMemo } from 'react';
import KeyValueTable, { type KeyValueRow } from '../../../../../ui/KeyValueTable/KeyValueTable';

interface ParamsTabProps {
  params: Array<{ name?: string; value?: string; disabled?: boolean; type?: string }>;
  onParamsChange: (params: KeyValueRow[]) => void;
  title?: string;
  description?: string;
}

interface ParamsSectionProps {
  title: string;
  description?: string;
  data: KeyValueRow[];
  onChange: (rows: KeyValueRow[]) => void;
  keyLabel?: string;
  showEnabled?: boolean;
  showActions?: boolean;
  disableNewRow?: boolean;
  readOnlyKey?: boolean;
}

/**
 * A single labelled key/value table. Memoized so that editing one params table
 * (e.g. query) doesn't force the sibling table (e.g. path) to re-render while
 * its data/handler references are unchanged.
 */
const ParamsSection: React.FC<ParamsSectionProps> = React.memo(({
  title,
  description,
  data,
  onChange,
  keyLabel = 'Key',
  showEnabled = true,
  showActions = true,
  disableNewRow = false,
  readOnlyKey = false
}) => (
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
      data={data}
      onChange={onChange}
      keyPlaceholder={keyLabel}
      valuePlaceholder="Value"
      showEnabled={showEnabled}
      showActions={showActions}
      disableNewRow={disableNewRow}
      readOnlyKey={readOnlyKey}
    />
  </div>
));

ParamsSection.displayName = 'ParamsSection';

export const ParamsTab: React.FC<ParamsTabProps> = ({
  params,
  onParamsChange,
  title = 'Query',
  description
}) => {
  // Single pass: split the params into query and path rows. `type` is kept on
  // each row so it survives the round-trip back through onParamsChange.
  const { queryData, pathData } = useMemo(() => {
    const queryData: KeyValueRow[] = [];
    const pathData: KeyValueRow[] = [];

    (params || [])?.forEach((param, index) => {
      const row: KeyValueRow = {
        id: `param-${index}`,
        name: param.name || '',
        value: param.value || '',
        enabled: !param.disabled,
        type: param.type || 'query'
      };
      (row.type === 'path' ? pathData : queryData).push(row);
    });

    return { queryData, pathData };
  }, [params]);

  // Each table only owns its own subset, so on change we re-tag the edited rows
  // and merge them back with the untouched sibling rows before bubbling up.
  const handleQueryChange = useCallback(
    (rows: KeyValueRow[]) => {
      const queryRows = (rows ?? []).map((row) => ({ ...row, type: 'query' }));
      onParamsChange([...queryRows, ...pathData]);
    },
    [onParamsChange, pathData]
  );

  const handlePathChange = useCallback(
    (rows: KeyValueRow[]) => {
      const pathRows = (rows ?? []).map((row) => ({ ...row, type: 'path' }));
      onParamsChange([...queryData, ...pathRows]);
    },
    [onParamsChange, queryData]
  );

  const hasPath = pathData.length > 0;

  return (
    <div className="space-y-4">
      {/* Query table: always shown so query params can be viewed/added
          regardless of whether the request currently has any. */}
      <ParamsSection
        title={title}
        description={description}
        data={queryData}
        onChange={handleQueryChange}
      />

      {/* Path table: only shown when the URL actually defines path params. */}
      {hasPath && (
        <ParamsSection
          title="Path"
          data={pathData}
          onChange={handlePathChange}
          keyLabel="Name"
          showEnabled={false}
          showActions={false}
          disableNewRow={true}
          readOnlyKey={true}
        />
      )}
    </div>
  );
};

export default ParamsTab;
