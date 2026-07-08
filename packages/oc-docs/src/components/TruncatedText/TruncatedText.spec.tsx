import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { TruncatedText } from './TruncatedText';

describe('TruncatedText', () => {
  it('renders the text inside a truncation span', () => {
    const html = renderToStaticMarkup(<TruncatedText text="Hello world" />);
    expect(html).toContain('Hello world');
    expect(html).toContain('oc-truncate');
  });

  it('renders custom children instead of the raw text when provided', () => {
    const html = renderToStaticMarkup(
      <TruncatedText text="raw">
        <em>rich</em>
      </TruncatedText>
    );
    expect(html).toContain('<em>rich</em>');
  });

  it('does not show a tooltip on the server (overflow is not yet measured)', () => {
    const html = renderToStaticMarkup(<TruncatedText text="Hello" />);
    expect(html).not.toContain('role="tooltip"');
  });

  it('merges an extra className onto the truncation span', () => {
    const html = renderToStaticMarkup(<TruncatedText text="x" className="my-cell" />);
    expect(html).toContain('oc-truncate');
    expect(html).toContain('my-cell');
  });
});
