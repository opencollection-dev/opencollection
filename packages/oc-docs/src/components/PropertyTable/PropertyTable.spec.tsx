import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { PropertyTable } from './PropertyTable';

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
});
