import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { SectionLabel } from './SectionLabel';

describe('SectionLabel', () => {
  it('renders its children as an h2 by default', () => {
    const html = renderToStaticMarkup(<SectionLabel>Environments</SectionLabel>);
    expect(html).toContain('Environments');
    expect(html).toContain('<h2');
  });

  it('renders the element supplied via the "as" prop', () => {
    const html = renderToStaticMarkup(<SectionLabel as="h3">Headers</SectionLabel>);
    expect(html).toContain('<h3');
    expect(html).toContain('Headers');
  });
});
