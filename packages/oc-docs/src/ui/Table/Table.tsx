import React from 'react';
import { StyledWrapper } from './StyledWrapper';

export interface TableColumn {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'right';
  width?: string;
}

export interface TableRow {
  id: string;
  cells: Record<string, React.ReactNode>;
  rowHeaderKey?: string;
  disabled?: boolean;
  testId?: string;
  description?: React.ReactNode;
}

export interface TableGroup {
  id: string;
  label?: React.ReactNode;
  badge?: React.ReactNode;
  meta?: React.ReactNode;
  rows: TableRow[];
  testId?: string;
}

interface TableProps {
  columns: TableColumn[];
  groups?: TableGroup[];
  rows?: TableRow[];
  caption?: string;
  emptyMessage?: string;
  minWidth?: string;
  className?: string;
  testId?: string;
}

const Cells: React.FC<{ row: TableRow; columns: TableColumn[] }> = ({ row, columns }) =>
  columns.map((column) => {
    const content = row.cells[column.key];
    const alignment = column.align ?? 'left';
    if (row.rowHeaderKey === column.key) {
      return (
        <th
          key={column.key}
          scope="row"
          className={`table-cell table-cell--${alignment} table-cell--head`}
          data-testid={`table-cell-${column.key}`}
        >
          {content}
        </th>
      );
    }
    return (
      <td
        key={column.key}
        className={`table-cell table-cell--${alignment}`}
        data-testid={`table-cell-${column.key}`}
      >
        {content}
      </td>
    );
  });

const Rows: React.FC<{ rows: TableRow[]; columns: TableColumn[] }> = ({ rows, columns }) =>
  rows.map((row) => (
    <React.Fragment key={row.id}>
      <tr
        className={['table-row', row.disabled ? 'table-row--disabled' : ''].filter(Boolean).join(' ')}
        data-testid={row.testId}
      >
        <Cells row={row} columns={columns} />
      </tr>
      <tr
        className={['table-row-description', row.disabled ? 'table-row--disabled' : ''].filter(Boolean).join(' ')}
        data-testid={row.testId ? `${row.testId}-description` : undefined}
      >
        <td colSpan={columns.length} className="table-description-cell">
          {row.description}
        </td>
      </tr>
    </React.Fragment>
  ));

export const Table: React.FC<TableProps> = ({
  columns,
  groups,
  rows,
  caption,
  emptyMessage,
  minWidth,
  className,
  testId
}) => {
  const groupList = groups ?? (rows ? [{ id: 'default', rows }] : []);
  const isEmpty = groupList.every((group) => group.rows.length === 0);

  if (isEmpty && emptyMessage) {
    return (
      <StyledWrapper className={['table-wrapper', className].filter(Boolean).join(' ')} data-testid={testId}>
        <p className="table-empty-message">{emptyMessage}</p>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper className={['table-wrapper', className].filter(Boolean).join(' ')} data-testid={testId}>
      <table className="table" style={minWidth ? { minWidth } : undefined}>
        {caption && <caption className="table-caption">{caption}</caption>}
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} style={column.width ? { width: column.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`table-head-cell table-cell--${column.align ?? 'left'}`}
                data-testid={`table-header-${column.key}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        {groupList.map((group) => (
          <tbody key={group.id} className="table-group" data-testid={group.testId}>
            {group.label !== undefined && (
              <tr className="table-group-row">
                <th scope="colgroup" colSpan={columns.length} className="table-group-cell">
                  <div className="table-group-inner">
                    <span className="table-group-label">{group.label}</span>
                    {group.badge !== undefined && <span className="table-group-badge">{group.badge}</span>}
                    {group.meta !== undefined && <span className="table-group-meta">{group.meta}</span>}
                  </div>
                </th>
              </tr>
            )}
            <Rows rows={group.rows} columns={columns} />
          </tbody>
        ))}
      </table>
    </StyledWrapper>
  );
};

export default Table;
