import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import Tabs, { type Tab } from './Tabs';

const tabs: Tab[] = [
  { id: 'a', label: 'Alpha', content: <span>Alpha content</span> },
  { id: 'b', label: 'Beta', content: <span>Beta content</span> }
];

describe('Tabs', () => {
  it('renders the underline variant by default with the first tab active', () => {
    const html = renderToStaticMarkup(<Tabs tabs={tabs} />);
    // Assert on the wrapper's class attribute (the emotion <style> block also
    // contains the variant selector names, so match `class="..."` specifically).
    expect(html).toContain('class="tabs-variant-underline');
    expect(html).not.toContain('class="tabs-variant-button');
    // First tab is active and its content is shown.
    expect(html).toContain('Alpha content');
    expect(html).not.toContain('Beta content');
  });

  it('applies the button variant class when variant="button"', () => {
    const html = renderToStaticMarkup(<Tabs tabs={tabs} variant="button" />);
    expect(html).toContain('class="tabs-variant-button');
    expect(html).not.toContain('class="tabs-variant-underline');
  });

  it('renders the controlled active tab', () => {
    const html = renderToStaticMarkup(<Tabs tabs={tabs} activeTab="b" />);
    expect(html).toContain('Beta content');
    expect(html).not.toContain('Alpha content');
  });
});
