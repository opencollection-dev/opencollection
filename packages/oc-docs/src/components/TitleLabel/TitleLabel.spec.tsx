import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { TitleLabel } from './TitleLabel';

describe('TitleLabel', () => {
  it('renders its children inside a paragraph', () => {
    const html = renderToStaticMarkup(<TitleLabel>Websocket</TitleLabel>);
    expect(html).toContain('<p');
    expect(html).toContain('Websocket');
  });

  it('applies the title-label class', () => {
    const html = renderToStaticMarkup(<TitleLabel>Label</TitleLabel>);
    expect(html).toMatch(/class="[^"]*title-label[^"]*"/);
  });

  it('defaults the testid to title-label', () => {
    const html = renderToStaticMarkup(<TitleLabel>Label</TitleLabel>);
    expect(html).toContain('data-testid="title-label"');
  });

  it('uses the testId prop when provided', () => {
    const html = renderToStaticMarkup(<TitleLabel testId="custom-title">Label</TitleLabel>);
    expect(html).toContain('data-testid="custom-title"');
  });
});
