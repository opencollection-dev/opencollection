import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the icon, heading and subheading', () => {
    const html = renderToStaticMarkup(
      <EmptyState
        icon={<svg data-testid="icon" />}
        heading="No environments yet"
        subheading="Add one in Bruno to manage base URLs and variables."
      />
    );

    expect(html).toContain('No environments yet');
    expect(html).toContain('Add one in Bruno to manage base URLs and variables.');
    expect(html).toContain('data-testid="icon"');
  });

  it('marks the icon as decorative for assistive technology', () => {
    const html = renderToStaticMarkup(
      <EmptyState icon={<svg />} heading="Heading" subheading="Subheading" />
    );

    expect(html).toContain('aria-hidden="true"');
  });
});
