import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import IconButton from './IconButton';

describe('IconButton', () => {
  it('renders a button with the accessible label and its child glyph', () => {
    const html = renderToStaticMarkup(
      <IconButton label="Toggle sidebar">
        <svg data-testid="glyph" />
      </IconButton>
    );
    expect(html).toContain('aria-label="Toggle sidebar"');
    expect(html).toContain('type="button"');
    expect(html).toContain('data-testid="glyph"');
  });

  it('forwards extra props (aria-expanded)', () => {
    const html = renderToStaticMarkup(
      <IconButton label="More options" aria-expanded={true}>
        <svg />
      </IconButton>
    );
    expect(html).toContain('aria-expanded="true"');
  });
});
