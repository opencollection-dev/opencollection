import React, { useState, useEffect, useCallback, useRef } from 'react';
import HighlightedInput from '../HighlightedInput/HighlightedInput';
import './KeyValueTable.css';

export interface KeyValueRow {
  id: string;
  name: string;
  value: string;
  enabled: boolean;
  [key: string]: any;
}

interface KeyValueTableProps {
  data: KeyValueRow[];
  onChange: (data: KeyValueRow[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  showEnabled?: boolean;
  additionalColumns?: Array<{
    key: string;
    label: string;
    render: (row: KeyValueRow, index: number) => React.ReactNode;
  }>;
  className?: string;
  disableNewRow?: boolean;
  disableDelete?: boolean;
  /** Enable variable highlighting for {{variables}} in value fields */
  enableVariableHighlighting?: boolean;
}

const generateId = () => `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const KeyValueTable: React.FC<KeyValueTableProps> = ({
  data,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  showEnabled = true,
  additionalColumns = [],
  className = '',
  disableNewRow = false,
  disableDelete = false,
  enableVariableHighlighting = false
}) => {
  const isEditingRef = useRef(false);
  const focusRef = useRef<{ index: number; field: 'name' | 'value' } | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
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
      const newRows = data.map((row, idx) => ({ ...row, id: row.id || `row-${idx}-${row.name || 'empty'}` }));
      setRows(newRows);
      return;
    }
    
    const hasEmptyRow = data.length > 0 && 
      (!data[data.length - 1].name || data[data.length - 1].name.trim() === '');
    
    const newRows = hasEmptyRow 
      ? data.map((row, idx) => ({ ...row, id: row.id || `row-${idx}-${row.name || 'empty'}` }))
      : [
          ...data.map((row, idx) => ({ ...row, id: row.id || `row-${idx}-${row.name || 'empty'}` })),
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
    if (focusRef.current) {
      const { index, field } = focusRef.current;
      const inputKey = `${index}-${field}`;
      const input = inputRefs.current[inputKey];
      if (input) {
        requestAnimationFrame(() => {
          input.focus();
          const len = input.value.length;
          input.setSelectionRange(len, len);
        });
      }
      focusRef.current = null;
    }
  }, [rows]);

  useEffect(() => {
    const timer = setTimeout(() => {
      isEditingRef.current = false;
    }, 300);
    return () => clearTimeout(timer);
  }, [rows]);

  const handleFieldChange = (index: number, field: 'name' | 'value' | 'enabled', value: any) => {
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
        focusRef.current = { index, field: 'name' };
      } else {
        focusRef.current = { index, field: field as 'name' | 'value' };
      }
    } else {
      focusRef.current = { index, field: field as 'name' | 'value' };
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

  return (
    <div className={`key-value-table-wrapper ${className}`}>
      <div className="key-value-table-container">
        <table className="key-value-table">
          <thead>
            <tr>
              {showEnabled && <th className="col-enabled">Enabled</th>}
              <th className="col-key">{keyPlaceholder}</th>
              <th className="col-value">{valuePlaceholder}</th>
              {additionalColumns.map(col => (
                <th key={col.key} className={`col-${col.key}`}>{col.label}</th>
              ))}
              <th className="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isLastRow = index === rows.length - 1;
              const isEmptyRow = !row.name || row.name.trim() === '';
              const isLastEmptyRow = isLastRow && isEmptyRow;

              return (
                <tr key={row.id} className={isLastEmptyRow ? 'empty-row' : ''}>
                  {showEnabled && (
                    <td className="col-enabled">
                      {!isLastEmptyRow && (
                        <input
                          type="checkbox"
                          className="checkbox-input"
                          checked={row.enabled}
                          onChange={(e) => handleFieldChange(index, 'enabled', e.target.checked)}
                        />
                      )}
                    </td>
                  )}
                  <td className="col-key">
                    <input
                      ref={(el) => {
                        inputRefs.current[`${index}-name`] = el;
                      }}
                      type="text"
                      className="text-input"
                      value={row.name}
                      placeholder={isLastEmptyRow ? keyPlaceholder : ''}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                  </td>
                  <td className="col-value">
                    {enableVariableHighlighting ? (
                      <HighlightedInput
                        value={row.value}
                        onChange={(value) => handleFieldChange(index, 'value', value)}
                        placeholder={isLastEmptyRow ? valuePlaceholder : ''}
                        className="text-input highlighted-value-input"
                      />
                    ) : (
                      <input
                        ref={(el) => {
                          inputRefs.current[`${index}-value`] = el;
                        }}
                        type="text"
                        className="text-input"
                        value={row.value}
                        placeholder={isLastEmptyRow ? valuePlaceholder : ''}
                        onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                      />
                    )}
                  </td>
                  {additionalColumns.map(col => (
                    <td key={col.key} className={`col-${col.key}`}>
                      {!isLastEmptyRow && col.render(row, index)}
                    </td>
                  ))}
                  <td className="col-actions">
                    {!isLastEmptyRow && !disableDelete && (
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleRemoveRow(index)}
                        aria-label="Delete row"
                        title="Delete row"
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

KeyValueTable.displayName = 'KeyValueTable';

export default KeyValueTable;

