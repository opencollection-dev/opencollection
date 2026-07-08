import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import Topbar from './Topbar';

// The "Open in Bruno" button only shows on desktop-sized screens and on devices
// that can run the Bruno app. Those checks need a real browser, which this test
// doesn't have, so they'd come back false and hide the button. We force them to
// "yes" here so the test can focus on the one thing it checks: the button shows
// only when it's given a link.
vi.mock('../../hooks/useCanRunBrunoApp', () => ({ useCanRunBrunoApp: () => true }));
vi.mock('../../hooks/useTopbarLayout', () => ({
  useTopbarLayout: () => 'desktop',
  showsHamburger: () => false,
}));

describe('Topbar', () => {
  it('renders the brand name and version', () => {
    const html = renderToStaticMarkup(<Topbar collectionName="Hotel Booking API" version="1.0.0" />);
    expect(html).toContain('Hotel Booking API');
    expect(html).toContain('>1.0.0<');
    expect(html).not.toContain('v1.0.0');
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

  it('shows the Open-in-Bruno CTA with an href pointing to the Fetch-in-Bruno page', () => {
    const html = renderToStaticMarkup(
      <Topbar collectionName="Docs" openInBrunoHref="https://fetch.usebruno.com?url=x" />
    );
    expect(html).toContain('data-testid="open-in-bruno"');
    expect(html).toContain('href="https://fetch.usebruno.com?url=x"');
  });

  it('hides the Open-in-Bruno CTA when no href (e.g. collection has no git url)', () => {
    const html = renderToStaticMarkup(<Topbar collectionName="Docs" />);
    expect(html).not.toContain('data-testid="open-in-bruno"');
  });
});
