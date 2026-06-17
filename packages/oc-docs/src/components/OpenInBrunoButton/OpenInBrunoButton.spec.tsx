import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import OpenInBrunoButton from './OpenInBrunoButton';

describe('OpenInBrunoButton', () => {
  it('renders an anchor with the bruno:// href and the label', () => {
    const html = renderToStaticMarkup(
      <OpenInBrunoButton href="bruno://app/collection/import/git?url=x" />
    );
    expect(html).toContain('href="bruno://app/collection/import/git?url=x"');
    expect(html).toContain('Open in Bruno');
  });

  it('renders a button (no href) and hides the label in icon-only mode', () => {
    const html = renderToStaticMarkup(<OpenInBrunoButton iconOnly />);
    expect(html).toContain('<button');
    expect(html).toContain('is-icon');
    expect(html).not.toContain('Open in Bruno</span>');
  });
});
