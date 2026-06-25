import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { SubHeading } from './SubHeading';

describe('SubHeading', () => {
  it('renders its children as an h3 by default', () => {
    const html = renderToStaticMarkup(<SubHeading>Headers</SubHeading>);
    expect(html).toContain('Headers');
    expect(html).toContain('<h3');
  });

  it('renders the element supplied via the "as" prop', () => {
    const html = renderToStaticMarkup(<SubHeading as="h4">Auth</SubHeading>);
    expect(html).toContain('<h4');
    expect(html).toContain('Auth');
  });
});
