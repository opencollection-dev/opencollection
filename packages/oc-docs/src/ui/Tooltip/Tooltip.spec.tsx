import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders the anchor element it wraps', () => {
    const html = renderToStaticMarkup(
      <Tooltip content="Full text">
        <span>anchor</span>
      </Tooltip>
    );
    expect(html).toContain('anchor');
  });

  it('does not render the tooltip bubble in server-rendered HTML', () => {
    const html = renderToStaticMarkup(
      <Tooltip content="Full text">
        <span>anchor</span>
      </Tooltip>
    );
    expect(html).not.toContain('role="tooltip"');
    expect(html).not.toContain('Full text');
  });

  it('renders only the anchor, with no tooltip, when disabled', () => {
    const html = renderToStaticMarkup(
      <Tooltip content="Full text" disabled>
        <span>anchor</span>
      </Tooltip>
    );
    expect(html).toContain('anchor');
    expect(html).not.toContain('Full text');
  });

  it('renders only the anchor when there is no tooltip content', () => {
    const html = renderToStaticMarkup(
      <Tooltip content="">
        <span>anchor</span>
      </Tooltip>
    );
    expect(html).toContain('anchor');
  });
});
