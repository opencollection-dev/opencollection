import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { formatToPreviewMode } from './previewMode';
import TextPreview from './TextPreview';
import HtmlPreview from './HtmlPreview';

describe('formatToPreviewMode', () => {
  it('maps formats to preview modes', () => {
    expect(formatToPreviewMode('html')).toBe('web');
    expect(formatToPreviewMode('json')).toBe('json');
    expect(formatToPreviewMode('xml')).toBe('xml');
    expect(formatToPreviewMode('javascript')).toBe('text');
    expect(formatToPreviewMode('raw')).toBe('text');
    expect(formatToPreviewMode('base64')).toBe('text');
    expect(formatToPreviewMode('hex')).toBe('text');
  });
});

describe('TextPreview', () => {
  it('stringifies object data', () => {
    const html = renderToStaticMarkup(<TextPreview data={{ a: 1 }} />);
    expect(html).toContain('{&quot;a&quot;:1}');
  });
});

describe('HtmlPreview', () => {
  it('renders a sandboxed iframe with an injected base href and no scripts', () => {
    const html = renderToStaticMarkup(<HtmlPreview data="<body>hi</body>" baseUrl="https://api.example.com/" />);
    expect(html).toContain('<iframe');
    expect(html).toContain('sandbox="allow-same-origin"');
    expect(html).not.toContain('allow-scripts');
    expect(html).toContain('base href=');
  });
});
