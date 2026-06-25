import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { CopyButton } from './CopyButton';

describe('CopyButton', () => {
  it('renders an accessible button with the default copy label', () => {
    const html = renderToStaticMarkup(<CopyButton text="hello" />);
    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Copy"');
  });

  it('uses the provided label', () => {
    const html = renderToStaticMarkup(<CopyButton text="hello" label="Copy code" />);
    expect(html).toContain('aria-label="Copy code"');
  });
});
