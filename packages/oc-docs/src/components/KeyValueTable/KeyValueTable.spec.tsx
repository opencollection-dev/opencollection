import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import KeyValueTable, { type KeyValueRow } from './KeyValueTable';

const noop = () => {};
const rows: KeyValueRow[] = [
  { id: 'r1', name: 'X-Trace', value: 'abc', enabled: true, description: 'Correlation id' }
];

const headerTexts = (root: ReturnType<typeof useRenderToDom>) =>
  root.querySelectorAll('thead th').map((th) => th.text.trim());

describe('KeyValueTable — description column', () => {
  it('renders a Description column and the authored description when showDescription is set', () => {
    const root = useRenderToDom(<KeyValueTable data={rows} onChange={noop} showDescription />);
    expect(headerTexts(root)).toContain('Description');
    expect(root.querySelector('[data-testid="key-value-table-description-input"]')).toBeTruthy();
    expect(root.text).toContain('Correlation id');
  });

  it('omits the Description column by default', () => {
    const root = useRenderToDom(<KeyValueTable data={rows} onChange={noop} />);
    expect(headerTexts(root)).not.toContain('Description');
    expect(root.querySelector('[data-testid="key-value-table-description-input"]')).toBeFalsy();
  });

  it('orders columns name → value → Description → delete when actions are inline', () => {
    // Headers/vars pass inlineActions (delete normally sits inside the value cell); adding the
    // description column pushes delete back out to its own trailing column, matching the app.
    const root = useRenderToDom(<KeyValueTable data={rows} onChange={noop} inlineActions showDescription />);
    const columnClasses = root.querySelectorAll('colgroup col').map((col) => col.getAttribute('class'));
    expect(columnClasses).toEqual(['col-key', 'col-value', 'col-description', 'col-actions']);
  });
});
