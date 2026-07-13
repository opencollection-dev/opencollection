import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Examples } from './Examples';
import type { HttpRequestExample } from '@opencollection/types/requests/http';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { query } from '../../test-utils/dom';

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

describe('Examples highlight', () => {
  it('marks the highlighted card active', () => {
    const root = useRenderToDom(
      <Examples examples={examples} method="POST" url="/x" highlightedIndex={1} />
    );
    expect(query(root, '[data-active="true"]').text).toContain('Unauthorized');
  });

  it('marks no card active without a highlight', () => {
    const root = useRenderToDom(<Examples examples={examples} method="POST" url="/x" />);
    expect(root.querySelector('[data-active="true"]')).toBeNull();
  });
});
