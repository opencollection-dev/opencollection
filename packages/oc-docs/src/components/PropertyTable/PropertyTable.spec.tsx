import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { PropertyTable } from './PropertyTable';
import { useRenderToDom } from '../../hooks/useRenderToDom';

describe('PropertyTable', () => {
  it('renders label/value rows', () => {
    const html = renderToStaticMarkup(
      <PropertyTable rows={[{ label: 'Accept', value: 'application/json' }]} />
    );
    expect(html).toContain('Accept');
    expect(html).toContain('application/json');
  });

  it('masks secret values', () => {
    const html = renderToStaticMarkup(
      <PropertyTable rows={[{ label: 'Token', value: 's3cr3t', secret: true }]} />
    );
    expect(html).toContain('Token');
    expect(html).not.toContain('s3cr3t');
  });

  it('shows the empty message when there are no rows', () => {
    const html = renderToStaticMarkup(<PropertyTable rows={[]} emptyMessage="Nothing here yet" />);
    expect(html).toContain('Nothing here yet');
  });

  it('renders custom node cells', () => {
    const html = renderToStaticMarkup(
      <PropertyTable rows={[{ label: 'Custom', node: <em>hi</em> }]} />
    );
    expect(html).toContain('<em>hi</em>');
  });

  it('renders a description as a truncatable line under the value (reuses Description)', () => {
    const root = useRenderToDom(
      <PropertyTable rows={[{ label: 'baseURL', value: 'https://api', description: 'API base URL' }]} />
    );
    const description = root.querySelector('.oc-description.oc-truncate');
    expect(description).not.toBeNull();
    expect(description!.text.trim()).toBe('API base URL');
  });

  it('omits the description line when a row has none', () => {
    const root = useRenderToDom(<PropertyTable rows={[{ label: 'baseURL', value: 'https://api' }]} />);
    expect(root.querySelector('.oc-description')).toBeNull();
  });
});
