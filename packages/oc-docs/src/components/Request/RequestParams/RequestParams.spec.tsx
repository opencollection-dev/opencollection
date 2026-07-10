import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { RequestParams } from './RequestParams';
import { useRenderToDom } from '../../../hooks/useRenderToDom';

describe('RequestParams', () => {
  it('renders Path and Query groups for the params present', () => {
    const html = renderToStaticMarkup(
      <RequestParams
        path={[{ name: 'postId', value: '1', type: 'path' }]}
        query={[{ name: 'q', value: 'alice', type: 'query' }]}
      />
    );
    expect(html).toContain('Path');
    expect(html).toContain('postId');
    expect(html).toContain('Query');
    expect(html).toContain('alice');
  });

  it('renders per-param descriptions', () => {
    const root = useRenderToDom(
      <RequestParams query={[{ name: 'q', value: 'alice', type: 'query', description: 'search term' }]} />
    );
    const description = root.querySelector('.description');
    expect(description).not.toBeNull();
    expect(description?.text.trim()).toBe('search term');
  });

  it('renders nothing when there are no params', () => {
    expect(renderToStaticMarkup(<RequestParams />)).toBe('');
  });
});
