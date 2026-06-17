import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import Brand from './Brand';

describe('Brand', () => {
  it('shows the collection name and a v-prefixed version', () => {
    const html = renderToStaticMarkup(<Brand collectionName="Hotel Booking API" version="1.0.0" />);
    expect(html).toContain('Hotel Booking API');
    expect(html).toContain('v1.0.0');
  });

  it('does not double the v prefix', () => {
    const html = renderToStaticMarkup(<Brand collectionName="X" version="v2.3" />);
    expect(html).toContain('v2.3');
    expect(html).not.toContain('vv2.3');
  });

  it('falls back to the initials avatar when no logo is given', () => {
    const html = renderToStaticMarkup(<Brand collectionName="Hotel Booking" />);
    expect(html).toContain('data-testid="brand-initials"');
    expect(html).toContain('HB');
  });

  it('renders a string logo as an image (overrides the avatar)', () => {
    const html = renderToStaticMarkup(<Brand collectionName="X" logo="/logo.svg" />);
    expect(html).toContain('src="/logo.svg"');
    expect(html).not.toContain('data-testid="brand-initials"');
  });
});
