import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Examples } from './Examples';
import type { HttpRequestExample } from '@opencollection/types/requests/http';

const examples: HttpRequestExample[] = [
  { name: 'Happy path', response: { status: 200, body: { type: 'json', data: '{}' } } },
  { name: 'Unauthorized', response: { status: 401 } }
];

describe('Examples', () => {
  it('renders one card per example with the first expanded', () => {
    const html = renderToStaticMarkup(<Examples examples={examples} method="post" url="/login" />);
    expect(html).toContain('Happy path');
    expect(html).toContain('Unauthorized');
    expect(html).toContain('REQUEST');
  });

  it('renders nothing when there are no examples', () => {
    expect(renderToStaticMarkup(<Examples examples={[]} method="get" url="/x" />)).toBe('');
    expect(renderToStaticMarkup(<Examples method="get" url="/x" />)).toBe('');
  });
});
