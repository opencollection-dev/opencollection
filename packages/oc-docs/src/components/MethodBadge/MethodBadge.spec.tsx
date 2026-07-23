import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { MethodBadge } from './MethodBadge';

const badgeText = (element: React.ReactElement): string =>
  renderToStaticMarkup(element)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();

describe('MethodBadge', () => {
  it('renders the method uppercased', () => {
    expect(renderToStaticMarkup(<MethodBadge method="post" />)).toContain('POST');
  });

  it('defaults to GET when no method is given', () => {
    expect(renderToStaticMarkup(<MethodBadge method="" />)).toContain('GET');
  });

  it('renders the abbreviated method when short is set', () => {
    expect(badgeText(<MethodBadge method="DELETE" short />)).toBe('DEL');
  });

  it('keeps short methods intact when short is set', () => {
    expect(badgeText(<MethodBadge method="GET" short />)).toBe('GET');
  });
});
