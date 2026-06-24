import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { PageWrapper } from './PageWrapper';

describe('PageWrapper', () => {
  it('renders its children', () => {
    const html = renderToStaticMarkup(
      <PageWrapper>
        <span>page content</span>
      </PageWrapper>
    );
    expect(html).toContain('page content');
  });
});
