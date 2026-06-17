import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Code } from './Code';

describe('Code (read-only viewer)', () => {
  it('renders the code content', () => {
    const html = renderToStaticMarkup(<Code code={'const a = 1;'} language="javascript" />);
    expect(html).toContain('const a = 1;');
  });

  it('renders one line number per line when showLineNumbers is set', () => {
    const html = renderToStaticMarkup(<Code code={'line1\nline2\nline3'} language="javascript" showLineNumbers />);
    expect(html).toContain('<span>1</span>');
    expect(html).toContain('<span>2</span>');
    expect(html).toContain('<span>3</span>');
    expect(html).not.toContain('<span>4</span>');
  });

  it('omits the line-number gutter by default', () => {
    const html = renderToStaticMarkup(<Code code={'a\nb'} language="javascript" />);
    // With no gutter, the line-number spans (<span>1</span>, …) are not rendered.
    expect(html).not.toContain('<span>1</span>');
    expect(html).not.toContain('<span>2</span>');
  });

  it('shows a copy button by default and hides it when showCopy is false', () => {
    expect(renderToStaticMarkup(<Code code={'x'} />)).toContain('<button');
    expect(renderToStaticMarkup(<Code code={'x'} showCopy={false} />)).not.toContain('<button');
  });
});
