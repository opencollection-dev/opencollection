import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { MethodBadge } from './MethodBadge';

describe('MethodBadge', () => {
  it('renders the method uppercased', () => {
    expect(renderToStaticMarkup(<MethodBadge method="post" />)).toContain('POST');
  });

  it('defaults to GET when no method is given', () => {
    expect(renderToStaticMarkup(<MethodBadge method="" />)).toContain('GET');
  });

  it('renders the abbreviated method when short is set', () => {
    const html = renderToStaticMarkup(<MethodBadge method="DELETE" short />);
    expect(html).toContain('>DEL<');
    expect(html).not.toContain('DELETE');
  });

  it('keeps short methods intact when short is set', () => {
    expect(renderToStaticMarkup(<MethodBadge method="GET" short />)).toContain('>GET<');
  });
});
