import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '@hooks/useRenderToDom';
import { Table, type TableColumn } from './Table';

const columns: TableColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'value', header: 'Value' }
];

describe('Table', () => {
  it('renders column headers and flat rows', () => {
    const root = useRenderToDom(
      <Table
        columns={columns}
        rows={[{ id: 'a', rowHeaderKey: 'name', cells: { name: 'baseUrl', value: 'https://api' } }]}
      />
    );

    const headers = root.querySelectorAll('thead th[scope="col"]').map((th) => th.text.trim());
    expect(headers).toEqual(['Name', 'Value']);

    expect(root.querySelector('tbody th[scope="row"]')?.text.trim()).toBe('baseUrl');
    expect(root.querySelectorAll('tbody td').map((td) => td.text.trim())).toContain('https://api');
  });

  it('renders grouped rows with a colgroup-scoped group header', () => {
    const root = useRenderToDom(
      <Table
        columns={columns}
        groups={[
          { id: 'g1', label: 'Variables', badge: 1, rows: [{ id: 'r1', cells: { name: 'x', value: '1' } }] },
          { id: 'g2', label: 'Secret Variables', badge: 1, rows: [{ id: 'r2', cells: { name: 'y', value: '2' } }] }
        ]}
      />
    );

    const groupHeaders = root
      .querySelectorAll('th[scope="colgroup"] .table-group-label')
      .map((el) => el.text.trim());
    expect(groupHeaders).toEqual(['Variables', 'Secret Variables']);
  });

  it('renders an accessible caption', () => {
    const root = useRenderToDom(<Table columns={columns} rows={[]} caption="My data" />);
    expect(root.querySelector('caption')?.text.trim()).toBe('My data');
  });

  it('shows the empty message when every group is empty', () => {
    const root = useRenderToDom(<Table columns={columns} rows={[]} emptyMessage="Nothing here" />);
    expect(root.querySelector('.table-empty-message')?.text.trim()).toBe('Nothing here');
    expect(root.querySelector('table')).toBeNull();
  });
});
