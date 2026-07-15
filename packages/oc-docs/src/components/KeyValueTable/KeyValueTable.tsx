import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useResolvedVariables } from '../../hooks/useVariableResolver';
import { Tooltip } from '../../ui/Tooltip/Tooltip';
import { WarningIcon } from '../../assets/icons';
import HighlightedInput from '../HighlightedInput/HighlightedInput';
import './KeyValueTable.css';

export interface KeyValueRow {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
  [key: string]: any;
}

export interface AdditionalColumn {
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
  disableDelete?: boolean;
  showActions?: boolean;
  readOnlyKey?: boolean;
  keyAutocomplete?: string[];
  valueAutocomplete?: string[];
  getRowError?: (row: KeyValueRow, index: number, field: 'name' | 'value') => string | null;
  valueHeader?: React.ReactNode;
  inlineActions?: boolean;
  testId?: string;
}

const generateId = () => `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const KeyValueTable: React.FC<KeyValueTableProps> = ({
  data,
  onChange,
  keyPlaceholder = 'Name',
  valuePlaceholder = 'Value',
  showEnabled = true,
  additionalColumns = [],
  className = '',
  disableNewRow = false,
  disableDelete = false,
  showActions = true,
  readOnlyKey = false,
  keyAutocomplete,
  valueAutocomplete,
  getRowError,
  valueHeader,
  inlineActions = false,
  testId = 'key-value-table'
}) => {
  const { isFound, names } = useResolvedVariables();
  const isEditingRef = useRef(false);
  const previousDataRef = useRef<string>('');

  const [rows, setRows] = useState<KeyValueRow[]>(() => {
    if (disableNewRow) {
      return data.map((row, idx) => ({ ...row, id: row.id || `row-${idx}` }));
    }
    
    const hasEmptyRow = data.length > 0 && 
      (!data[data.length - 1].name || data[data.length - 1].name.trim() === '');
    
    if (hasEmptyRow) {
      return data.map((row, idx) => ({ ...row, id: row.id || `row-${idx}` }));
    }
    
    return [
      ...data.map((row, idx) => ({ ...row, id: row.id || `row-${idx}` })),
      {
        id: generateId(),
        name: '',
        value: '',
        enabled: true
      }
    ];
  });

  useEffect(() => {
    if (isEditingRef.current) {
      return;
    }

    const dataString = JSON.stringify(data);
    if (dataString === previousDataRef.current) {
      return;
    }
    previousDataRef.current = dataString;

    if (disableNewRow) {
      const newRows = data.map((row, idx) => ({ ...row, id: row.id || `row-${idx}` }));
      setRows(newRows);
      return;
    }
    
    const hasEmptyRow = data.length > 0 && 
      (!data[data.length - 1].name || data[data.length - 1].name.trim() === '');
    
    const newRows = hasEmptyRow 
      ? data.map((row, idx) => ({ ...row, id: row.id || `row-${idx}` }))
      : [
          ...data.map((row, idx) => ({ ...row, id: row.id || `row-${idx}` })),
          {
            id: generateId(),
            name: '',
            value: '',
            enabled: true
          }
        ];
    
    setRows(newRows);
  }, [data, disableNewRow]);

  const notifyChange = useCallback((updatedRows: KeyValueRow[]) => {
    const nonEmptyRows = updatedRows.filter(row => 
      row.name && row.name.trim() !== ''
    );
    onChange(nonEmptyRows);
  }, [onChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      isEditingRef.current = false;
    }, 300);
    return () => clearTimeout(timer);
  }, [rows]);

  const handleFieldChange = (index: number, field: string, value: any) => {
    isEditingRef.current = true;
    
    const updatedRows = [...rows];
    const currentRow = updatedRows[index];
    const oldName = currentRow.name;
    updatedRows[index] = { ...currentRow, [field]: value };

    if (!disableNewRow) {
      const isLastRow = index === rows.length - 1;
      const wasNameEmpty = !oldName || oldName.trim() === '';
      const isNowTyping = field === 'name' && value && value.trim() !== '';

      if (isLastRow && isNowTyping && wasNameEmpty) {
        updatedRows.push({
          id: generateId(),
          name: '',
          value: '',
          enabled: true
        });
      }
    }

    setRows(updatedRows);
    notifyChange(updatedRows);
  };

  const handleRemoveRow = useCallback((index: number) => {
    setRows((prevRows) => {
      const row = prevRows[index];
      const isLastRow = index === prevRows.length - 1;
      const isEmptyRow = !row.name || row.name.trim() === '';

      if (isLastRow && isEmptyRow) {
        return prevRows;
      }

      const updatedRows = prevRows.filter((_, i) => i !== index);

      if (!disableNewRow) {
        const hasEmptyLastRow = updatedRows.length > 0 && 
          (!updatedRows[updatedRows.length - 1].name || 
           updatedRows[updatedRows.length - 1].name.trim() === '');

        if (!hasEmptyLastRow) {
          updatedRows.push({
            id: generateId(),
            name: '',
            value: '',
            enabled: true
          });
        }
      }

      notifyChange(updatedRows);
      return updatedRows;
    });
  }, [disableNewRow, notifyChange]);

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
              const updateField = (field: string, value: unknown) => handleFieldChange(index, field, value);

              const deleteButton = (
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleRemoveRow(index)}
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
                              onChange={(e) => handleFieldChange(index, 'enabled', e.target.checked)}
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
                          onValueChange={(v) => handleFieldChange(index, 'name', v)}
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
                          <HighlightedInput
                            value={row.value}
                            placeholder={isLastEmptyRow ? valuePlaceholder : ''}
                            onValueChange={(v) => handleFieldChange(index, 'value', v)}
                            isFound={isFound}
                            names={names}
                            anywordHints={valueAutocomplete}
                            title={row.value}
                            testId={`${testId}-value-input`}
                          />
                        </div>
                        {!isLastEmptyRow && cellError(row, index, 'value')}
                        {!isLastEmptyRow && (
                          <div className="value-cell-trailing">
                            {additionalColumns.map((col) => (
                              <React.Fragment key={col.key}>{col.render(row, index, updateField)}</React.Fragment>
                            ))}
                            {showActions && !disableDelete && deleteButton}
                          </div>
                        )}
                      </div>
                    ) : (
                      <HighlightedInput
                        value={row.value}
                        placeholder={isLastEmptyRow ? valuePlaceholder : ''}
                        onValueChange={(v) => handleFieldChange(index, 'value', v)}
                        isFound={isFound}
                        names={names}
                        anywordHints={valueAutocomplete}
                        title={row.value}
                        testId={`${testId}-value-input`}
                      />
                    )}
                  </td>
                  {!inlineActions &&
                    additionalColumns.map((col) => (
                      <td key={col.key} className={`col-${col.key}`}>
                        {!isLastEmptyRow && col.render(row, index, updateField)}
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

