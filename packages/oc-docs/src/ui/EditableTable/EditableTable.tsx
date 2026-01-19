import React, { useCallback, useMemo, useRef, useState } from 'react';
import './EditableTable.css';

/**
 * Column definition for EditableTable
 */
export interface EditableTableColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Display name in header */
  name: string;
  /** Marks this as the primary key field (for empty row detection) */
  isKeyField?: boolean;
  /** Placeholder text for inputs */
  placeholder?: string;
  /** Column width (CSS value like '30%' or 'auto') */
  width?: string;
  /** Make column read-only */
  readOnly?: boolean;
  /** Custom getter for cell value */
  getValue?: (row: T) => string;
  /** Custom cell renderer */
  render?: (props: CellRenderProps<T>) => React.ReactNode;
}

/**
 * Props passed to custom cell render functions
 */
export interface CellRenderProps<T> {
  row: T;
  value: string;
  rowIndex: number;
  isLastEmptyRow: boolean;
  onChange: (newValue: string) => void;
  error?: string | null;
}

/**
 * Base row interface - rows must have a uid
 */
export interface EditableTableRow {
  uid: string;
  [key: string]: any;
}

interface EditableTableProps<T extends EditableTableRow> {
  /** Column definitions */
  columns: EditableTableColumn<T>[];
  /** Row data */
  rows: T[];
  /** Callback when data changes */
  onChange: (rows: T[]) => void;
  /** Template for new empty rows */
  defaultRow: Omit<T, 'uid'>;
  /** Function to validate rows and return errors */
  getRowError?: (row: T, rowIndex: number, columnKey: string) => string | null;
  /** Show checkbox column (default: true) */
  showCheckbox?: boolean;
  /** Show delete button column (default: true) */
  showDelete?: boolean;
  /** Disable checkbox interactions (default: false) */
  disableCheckbox?: boolean;
  /** Label for checkbox header */
  checkboxLabel?: string;
  /** Property key for checkbox state (default: 'enabled') */
  checkboxKey?: string;
  /** Enable drag-to-reorder rows (default: false) */
  reorderable?: boolean;
  /** Callback when rows are reordered */
  onReorder?: (data: { updateReorderedItem: string[] }) => void;
  /** Show empty row for adding new entries (default: true) */
  showAddRow?: boolean;
  /** Additional CSS class */
  className?: string;
}

const generateUid = (): string => `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function EditableTable<T extends EditableTableRow>({
  columns,
  rows,
  onChange,
  defaultRow,
  getRowError,
  showCheckbox = true,
  showDelete = true,
  disableCheckbox = false,
  checkboxLabel = '',
  checkboxKey = 'enabled',
  reorderable = false,
  onReorder,
  showAddRow = true,
  className = ''
}: EditableTableProps<T>): React.ReactElement {
  const tableRef = useRef<HTMLDivElement>(null);
  const emptyRowUidRef = useRef<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const createEmptyRow = useCallback((): T => {
    const newUid = generateUid();
    emptyRowUidRef.current = newUid;
    return {
      uid: newUid,
      [checkboxKey]: true,
      ...defaultRow
    } as T;
  }, [defaultRow, checkboxKey]);

  const rowsWithEmpty = useMemo((): T[] => {
    if (!showAddRow) {
      return rows;
    }

    if (rows.length === 0) {
      return [createEmptyRow()];
    }

    const lastRow = rows[rows.length - 1];
    const keyColumn = columns.find((col) => col.isKeyField);

    if (keyColumn) {
      const lastRowKeyValue = keyColumn.getValue ? keyColumn.getValue(lastRow) : lastRow[keyColumn.key];
      const isLastRowEmpty = !lastRowKeyValue || (typeof lastRowKeyValue === 'string' && lastRowKeyValue.trim() === '');

      if (isLastRowEmpty) {
        return rows;
      }
    }

    if (!emptyRowUidRef.current || rows.some((r) => r.uid === emptyRowUidRef.current)) {
      emptyRowUidRef.current = generateUid();
    }

    return [
      ...rows,
      {
        uid: emptyRowUidRef.current,
        [checkboxKey]: true,
        ...defaultRow
      } as T
    ];
  }, [rows, columns, defaultRow, checkboxKey, createEmptyRow, showAddRow]);

  const isEmptyRow = useCallback((row: T): boolean => {
    const keyColumn = columns.find((col) => col.isKeyField);
    if (!keyColumn) return false;

    const value = keyColumn.getValue ? keyColumn.getValue(row) : row[keyColumn.key];
    return !value || (typeof value === 'string' && value.trim() === '');
  }, [columns]);

  const isLastEmptyRow = useCallback((row: T, index: number): boolean => {
    if (!showAddRow) return false;
    return index === rowsWithEmpty.length - 1 && isEmptyRow(row);
  }, [rowsWithEmpty.length, isEmptyRow, showAddRow]);

  const handleValueChange = useCallback((rowUid: string, key: string, value: any) => {
    const rowIndex = rowsWithEmpty.findIndex((r) => r.uid === rowUid);
    if (rowIndex === -1) return;

    const currentRow = rowsWithEmpty[rowIndex];
    const isLast = rowIndex === rowsWithEmpty.length - 1;
    const wasEmpty = isEmptyRow(currentRow);

    const keyColumn = columns.find((col) => col.isKeyField);
    const isKeyFieldChange = keyColumn && keyColumn.key === key;

    let updatedRows = rowsWithEmpty.map((row) => {
      if (row.uid === rowUid) {
        return { ...row, [key]: value };
      }
      return row;
    });

    if (showAddRow && isLast && wasEmpty && isKeyFieldChange && value && value.trim() !== '') {
      emptyRowUidRef.current = generateUid();
      updatedRows.push({
        uid: emptyRowUidRef.current,
        [checkboxKey]: true,
        ...defaultRow
      } as T);
    }

    const hasAnyValue = (row: T): boolean => {
      for (const col of columns) {
        const val = col.getValue ? col.getValue(row) : row[col.key];
        const defaultVal = (defaultRow as any)[col.key];
        if (val && val !== defaultVal && (typeof val !== 'string' || val.trim() !== '')) {
          return true;
        }
      }
      return false;
    };

    const result = updatedRows.filter((row, i) => {
      if (showAddRow && i === updatedRows.length - 1) {
        return hasAnyValue(row);
      }
      return true;
    });

    onChange(result);
  }, [rowsWithEmpty, columns, onChange, checkboxKey, defaultRow, isEmptyRow, showAddRow]);

  const handleCheckboxChange = useCallback((rowUid: string, checked: boolean) => {
    handleValueChange(rowUid, checkboxKey, checked);
  }, [handleValueChange, checkboxKey]);

  const handleRemoveRow = useCallback((rowUid: string) => {
    const filteredRows = rows.filter((row) => row.uid !== rowUid);
    onChange(filteredRows);
  }, [rows, onChange]);

  const getColumnWidth = useCallback((column: EditableTableColumn<T>): string => {
    if (column.width) return column.width;
    return 'auto';
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    setDragStart(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredRow(index);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (fromIndex !== toIndex && onReorder) {
      const reorderableRows = showAddRow ? rowsWithEmpty.slice(0, -1) : rowsWithEmpty;
      const updatedOrder = [...reorderableRows];
      const [movedRow] = updatedOrder.splice(fromIndex, 1);
      updatedOrder.splice(toIndex, 0, movedRow);
      onReorder({ updateReorderedItem: updatedOrder.map((row) => row.uid) });
    }
    setDragStart(null);
    setHoveredRow(null);
  }, [onReorder, rowsWithEmpty, showAddRow]);

  const handleDragEnd = useCallback(() => {
    setDragStart(null);
    setHoveredRow(null);
  }, []);

  const renderCell = useCallback((column: EditableTableColumn<T>, row: T, rowIndex: number) => {
    const isEmpty = isLastEmptyRow(row, rowIndex);
    const value = column.getValue ? column.getValue(row) : (row[column.key] || '');
    const error = getRowError?.(row, rowIndex, column.key);

    if (column.render) {
      return column.render({
        row,
        value,
        rowIndex,
        isLastEmptyRow: isEmpty,
        onChange: (newValue) => handleValueChange(row.uid, column.key, newValue),
        error
      });
    }

    return (
      <div className="cell-content">
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="cell-input"
          value={value}
          readOnly={column.readOnly}
          placeholder={isEmpty ? (column.placeholder || column.name) : ''}
          onChange={(e) => handleValueChange(row.uid, column.key, e.target.value)}
        />
        {error && !isEmpty && (
          <span className="cell-error" title={error}>
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </span>
        )}
      </div>
    );
  }, [isLastEmptyRow, getRowError, handleValueChange]);

  const reorderableRowCount = showAddRow ? rowsWithEmpty.length - 1 : rowsWithEmpty.length;

  return (
    <div className={`editable-table-wrapper ${showCheckbox ? 'has-checkbox' : 'no-checkbox'} ${className}`}>
      <div className="editable-table-container" ref={tableRef}>
        <table className="editable-table">
          <thead>
            <tr>
              {showCheckbox && (
                <td className="col-checkbox">{checkboxLabel}</td>
              )}
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{ width: getColumnWidth(column) }}
                >
                  {column.name}
                </td>
              ))}
              {showDelete && (
                <td className="col-actions"></td>
              )}
            </tr>
          </thead>
          <tbody>
            {rowsWithEmpty.map((row, rowIndex) => {
              const isEmpty = isLastEmptyRow(row, rowIndex);
              const canDrag = reorderable && !isEmpty && rowIndex < reorderableRowCount;

              return (
                <tr
                  key={row.uid}
                  className={`${isEmpty ? 'empty-row' : ''} ${hoveredRow === rowIndex ? 'hovered' : ''} ${dragStart === rowIndex ? 'dragging' : ''}`}
                  draggable={canDrag}
                  onDragStart={canDrag ? (e) => handleDragStart(e, rowIndex) : undefined}
                  onDragOver={canDrag ? (e) => handleDragOver(e, rowIndex) : undefined}
                  onDrop={canDrag ? (e) => handleDrop(e, rowIndex) : undefined}
                  onDragEnd={canDrag ? handleDragEnd : undefined}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {showCheckbox && (
                    <td className="col-checkbox">
                      {reorderable && canDrag && hoveredRow === rowIndex && (
                        <div className="drag-handle">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="9" cy="5" r="1" />
                            <circle cx="9" cy="12" r="1" />
                            <circle cx="9" cy="19" r="1" />
                            <circle cx="15" cy="5" r="1" />
                            <circle cx="15" cy="12" r="1" />
                            <circle cx="15" cy="19" r="1" />
                          </svg>
                        </div>
                      )}
                      {!isEmpty && (
                        <input
                          type="checkbox"
                          className="checkbox-input"
                          checked={row[checkboxKey] ?? true}
                          disabled={disableCheckbox}
                          onChange={(e) => handleCheckboxChange(row.uid, e.target.checked)}
                        />
                      )}
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={`col-${column.key}`}>
                      {renderCell(column, row, rowIndex)}
                    </td>
                  ))}
                  {showDelete && (
                    <td className="col-actions">
                      {!isEmpty && (
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleRemoveRow(row.uid)}
                          aria-label="Delete row"
                          title="Delete row"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

EditableTable.displayName = 'EditableTable';

export default EditableTable;
