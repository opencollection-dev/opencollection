import React from 'react';
import { useResolvedVariables } from '../../hooks/useVariableResolver';
import { useEditableRows } from '../../hooks/useEditableRows';
import { Tooltip } from '../../ui/Tooltip/Tooltip';
import { WarningIcon } from '../../assets/icons';
import HighlightedInput from '../HighlightedInput/HighlightedInput';
import { SecretValue } from '../../ui/SecretValue/SecretValue';
import './KeyValueTable.css';

export interface KeyValueRow {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
  [key: string]: any;
}

interface AdditionalColumn {
  key: string;
  label: string;
  render: (
    row: KeyValueRow,
    index: number,
    updateField: (field: string, value: unknown) => void
  ) => React.ReactNode;
}

interface KeyValueTableProps {
  data: KeyValueRow[];
  onChange: (data: KeyValueRow[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  showEnabled?: boolean;
  additionalColumns?: AdditionalColumn[];
  className?: string;
  disableNewRow?: boolean;
  makeNewRow?: () => Partial<KeyValueRow>;
  addWhenComplete?: boolean;
  disableDelete?: boolean;
  showActions?: boolean;
  readOnlyKey?: boolean;
  keyAutocomplete?: string[];
  valueAutocomplete?: string[];
  getRowError?: (row: KeyValueRow, index: number, field: 'name' | 'value') => string | null;
  valueHeader?: React.ReactNode;
  inlineActions?: boolean;
  multilineValues?: boolean;
  testId?: string;
}

const KeyValueTable: React.FC<KeyValueTableProps> = ({
  data,
  onChange,
  keyPlaceholder = 'Name',
  valuePlaceholder = 'Value',
  showEnabled = true,
  additionalColumns = [],
  className = '',
  disableNewRow = false,
  makeNewRow,
  addWhenComplete = false,
  disableDelete = false,
  showActions = true,
  readOnlyKey = false,
  keyAutocomplete,
  valueAutocomplete,
  getRowError,
  valueHeader,
  inlineActions = false,
  multilineValues = false,
  testId = 'key-value-table'
}) => {
  const { isFound, names } = useResolvedVariables();
  const { rows, updateField, removeRow } = useEditableRows(data, onChange, { disableNewRow, makeNewRow, addWhenComplete });

  const cellError = (row: KeyValueRow, index: number, field: 'name' | 'value') => {
    const message = getRowError?.(row, index, field);
    if (!message) return null;
    return (
      <Tooltip content={message}>
        <span className="cell-error" role="img" aria-label={message} data-testid={`${testId}-error`}>
          <WarningIcon />
        </span>
      </Tooltip>
    );
  };

  return (
    <div className={`key-value-table-wrapper ${className}`} data-testid={testId}>
      <div className="key-value-table-container" data-testid={`${testId}-container`}>
        <table className="key-value-table" data-testid={`${testId}-table`}>
          <colgroup>
            <col className="col-key" />
            <col className="col-value" />
            {!inlineActions &&
              additionalColumns.map((col) => <col key={col.key} className={`col-${col.key}`} />)}
            {!inlineActions && showActions && <col className="col-actions" />}
          </colgroup>
          <thead>
            <tr>
              <th className="col-key">{keyPlaceholder}</th>
              <th className="col-value">{valueHeader ?? valuePlaceholder}</th>
              {!inlineActions &&
                additionalColumns.map((col) => (
                  <th key={col.key} className={`col-${col.key}`}>
                    {col.label}
                  </th>
                ))}
              {!inlineActions && showActions && <th className="col-actions"></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isLastRow = index === rows.length - 1;
              const isEmptyRow = !row.name || row.name.trim() === '';
              const isLastEmptyRow = isLastRow && isEmptyRow;
              const updateCell = (field: string, value: unknown) => updateField(index, field, value);

              const deleteButton = (
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => removeRow(index)}
                  aria-label="Delete row"
                  title="Delete row"
                >
                  <svg
                    width="12"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              );

              return (
                <tr key={row.id} className={isLastEmptyRow ? 'empty-row' : ''}>
                  <td className="col-key">
                    <div className="key-cell">
                      {showEnabled && (
                        <span className="checkbox-slot">
                          {!isLastEmptyRow && (
                            <input
                              type="checkbox"
                              className="checkbox-input"
                              checked={row.enabled}
                              aria-label={row.name ? `Enable ${row.name}` : 'Enable row'}
                              onChange={(e) => updateField(index, 'enabled', e.target.checked)}
                            />
                          )}
                        </span>
                      )}
                      {readOnlyKey ? (
                        <span className="text-readonly" title={row.name}>
                          {row.name}
                        </span>
                      ) : (
                        <HighlightedInput
                          value={row.name}
                          placeholder={isLastEmptyRow ? keyPlaceholder : ''}
                          onValueChange={(v) => updateField(index, 'name', v)}
                          isFound={isFound}
                          names={names}
                          anywordHints={keyAutocomplete}
                          variablesAutocomplete={false}
                          title={row.name}
                          testId={`${testId}-name-input`}
                        />
                      )}
                      {!isLastEmptyRow && cellError(row, index, 'name')}
                    </div>
                  </td>
                  <td className="col-value">
                    {inlineActions ? (
                      <div className="value-cell">
                        <div className="value-cell-field">
                          {row.secret ? (
                            <SecretValue
                              value={row.value}
                              placeholder={valuePlaceholder}
                              onChange={(v) => updateField(index, 'value', v)}
                            />
                          ) : (
                            <HighlightedInput
                              value={row.value}
                              placeholder={isLastEmptyRow ? valuePlaceholder : ''}
                              onValueChange={(v) => updateField(index, 'value', v)}
                              isFound={isFound}
                              names={names}
                              anywordHints={valueAutocomplete}
                              multiline={multilineValues}
                              title={row.value}
                              testId={`${testId}-value-input`}
                            />
                          )}
                        </div>
                        {!isLastEmptyRow && cellError(row, index, 'value')}
                        {!isLastEmptyRow && (
                          <div className="value-cell-trailing">
                            {additionalColumns.map((col) => (
                              <React.Fragment key={col.key}>{col.render(row, index, updateCell)}</React.Fragment>
                            ))}
                            {showActions && !disableDelete && deleteButton}
                          </div>
                        )}
                      </div>
                    ) : row.secret ? (
                      <SecretValue
                        value={row.value}
                        placeholder={valuePlaceholder}
                        onChange={(v) => updateField(index, 'value', v)}
                      />
                    ) : (
                      <HighlightedInput
                        value={row.value}
                        placeholder={isLastEmptyRow ? valuePlaceholder : ''}
                        onValueChange={(v) => updateField(index, 'value', v)}
                        isFound={isFound}
                        names={names}
                        anywordHints={valueAutocomplete}
                        multiline={multilineValues}
                        title={row.value}
                        testId={`${testId}-value-input`}
                      />
                    )}
                  </td>
                  {!inlineActions &&
                    additionalColumns.map((col) => (
                      <td key={col.key} className={`col-${col.key}`}>
                        {!isLastEmptyRow && col.render(row, index, updateCell)}
                      </td>
                    ))}
                  {!inlineActions && showActions && (
                    <td className="col-actions">{!isLastEmptyRow && !disableDelete && deleteButton}</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeyValueTable;
