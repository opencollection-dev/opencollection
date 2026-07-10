import React from 'react';
import { describe, it, expect } from 'vitest';
import { PropertyTable } from './PropertyTable';
import { useRenderToDom } from '../../hooks/useRenderToDom';

describe('PropertyTable', () => {
  it('renders label/value rows', () => {
    const root = useRenderToDom(<PropertyTable rows={[{ label: 'Accept', value: 'application/json' }]} />);
    expect(root.querySelector('.property-key')?.text).toContain('Accept');
    expect(root.querySelector('.property-value-cell')?.text).toContain('application/json');
  });

  it('masks secret values', () => {
    const root = useRenderToDom(<PropertyTable rows={[{ label: 'Token', value: 's3cr3t', secret: true }]} />);
    const value = root.querySelector('.property-value-cell');
    expect(root.querySelector('.property-key')?.text).toContain('Token');
    expect(value?.querySelector('.secret-value-text')).not.toBeNull();
    expect(value?.text).not.toContain('s3cr3t');
  });

  it('shows the empty message when there are no rows', () => {
    const root = useRenderToDom(<PropertyTable rows={[]} emptyMessage="Nothing here yet" />);
    expect(root.querySelector('[data-testid="property-table-empty"]')?.text).toBe('Nothing here yet');
  });

  it('renders custom node cells', () => {
    const root = useRenderToDom(<PropertyTable rows={[{ label: 'Custom', node: <em>hi</em> }]} />);
    expect(root.querySelector('.property-value-cell em')?.text).toBe('hi');
  });

  it('renders a description as a truncatable line under the value (reuses Description)', () => {
    const root = useRenderToDom(
      <PropertyTable rows={[{ label: 'baseURL', value: 'https://api', description: '  API base URL  ' }]} />
    );
    const description = root.querySelector('.description.oc-truncate');
    expect(description).not.toBeNull();
    expect(description?.text).toBe('API base URL');
  });

  it('omits the description line when a row has none', () => {
    const root = useRenderToDom(<PropertyTable rows={[{ label: 'baseURL', value: 'https://api' }]} />);
    expect(root.querySelector('.description')).toBeNull();
  });
});
