import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import Topbar from './Topbar';

describe('Topbar', () => {
  it('renders the brand name and version', () => {
    const html = renderToStaticMarkup(<Topbar collectionName="Hotel Booking API" version="1.0.0" />);
    expect(html).toContain('Hotel Booking API');
    expect(html).toContain('v1.0.0');
  });

  it('renders the provided search slot node', () => {
    const html = renderToStaticMarkup(
      <Topbar collectionName="Docs" searchSlot={<input data-testid="search-slot-input" />} />
    );
    expect(html).toContain('data-testid="search-slot-input"');
  });

  it('degrades gracefully with no slots (still renders the bar)', () => {
    const html = renderToStaticMarkup(<Topbar collectionName="Docs" />);
    expect(html).toContain('topbar-bar');
  });
});
