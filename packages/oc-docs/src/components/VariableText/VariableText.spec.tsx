import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { VariableText } from './VariableText';

describe('VariableText', () => {
  it('highlights {{variable}} tokens while leaving surrounding text plain', () => {
    const html = renderToStaticMarkup(<VariableText value="{{baseUrl}}/api/v1/auth" />);
    expect(html).toContain('<span class="var">{{baseUrl}}</span>');
    expect(html).toContain('/api/v1/auth');
  });

  it('renders plain text without a token span', () => {
    const html = renderToStaticMarkup(<VariableText value="application/json" />);
    expect(html).toContain('application/json');
    expect(html).not.toContain('class="var"');
  });
});
