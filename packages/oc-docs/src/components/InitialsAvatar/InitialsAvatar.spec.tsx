import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import InitialsAvatar from './InitialsAvatar';

describe('InitialsAvatar', () => {
  it('renders the initials for a multi-word collection name', () => {
    const html = renderToStaticMarkup(<InitialsAvatar collectionName="Hotel Booking API" />);
    expect(html).toContain('HB');
  });

  it('renders a single letter for a one-word name', () => {
    const html = renderToStaticMarkup(<InitialsAvatar collectionName="Echo" />);
    expect(html).toContain('>E<');
  });
});
