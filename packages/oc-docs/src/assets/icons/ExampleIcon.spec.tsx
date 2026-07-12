import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ExampleIcon } from './ExampleIcon';

describe('ExampleIcon', () => {
  it('renders a decorative svg glyph', () => {
    const html = renderToStaticMarkup(<ExampleIcon />);
    expect(html).toContain('<svg');
    expect(html).toContain('aria-hidden="true"');
  });
});
