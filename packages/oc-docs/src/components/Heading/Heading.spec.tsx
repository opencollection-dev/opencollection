import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders its children as an h1 by default', () => {
    const html = renderToStaticMarkup(<Heading>Hotel Booking API</Heading>);
    expect(html).toContain('Hotel Booking API');
    expect(html).toContain('<h1');
  });

  it('renders the element supplied via the "as" prop', () => {
    const html = renderToStaticMarkup(<Heading as="h2">Section</Heading>);
    expect(html).toContain('<h2');
    expect(html).toContain('Section');
  });
});
