import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Table, type TableColumn } from './Table';

const columns: TableColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'value', header: 'Value' }
];

describe('Table', () => {
  it('renders column headers and flat rows', () => {
    const html = renderToStaticMarkup(
      <Table
        columns={columns}
        rows={[{ id: 'a', rowHeaderKey: 'name', cells: { name: 'baseUrl', value: 'https://api' } }]}
      />
    );
    expect(html).toContain('scope="col"');
    expect(html).toContain('Name');
    expect(html).toContain('Value');
    expect(html).toContain('<th scope="row"');
    expect(html).toContain('baseUrl');
    expect(html).toContain('https://api');
  });

  it('renders grouped rows with a colgroup-scoped group header', () => {
    const html = renderToStaticMarkup(
      <Table
        columns={columns}
        groups={[
          { id: 'g1', label: 'Variables', badge: 1, rows: [{ id: 'r1', cells: { name: 'x', value: '1' } }] },
          { id: 'g2', label: 'Secret Variables', badge: 1, rows: [{ id: 'r2', cells: { name: 'y', value: '2' } }] }
        ]}
      />
    );
    expect(html).toContain('scope="colgroup"');
    expect(html).toContain('Variables');
    expect(html).toContain('Secret Variables');
  });

  it('renders an accessible caption', () => {
    const html = renderToStaticMarkup(<Table columns={columns} rows={[]} caption="My data" />);
    expect(html).toContain('<caption');
    expect(html).toContain('My data');
  });

  it('shows the empty message when every group is empty', () => {
    const html = renderToStaticMarkup(<Table columns={columns} rows={[]} emptyMessage="Nothing here" />);
    expect(html).toContain('Nothing here');
    expect(html).not.toContain('<table');
  });
});
