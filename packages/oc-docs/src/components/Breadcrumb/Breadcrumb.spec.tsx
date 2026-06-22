import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders ancestor folders and the current page', () => {
    const html = renderToStaticMarkup(
      <Breadcrumb segments={[{ name: 'Authentication', uuid: 'a' }]} current="Login" />
    );
    expect(html).toContain('Authentication');
    expect(html).toContain('Login');
    expect(html).toContain('aria-current="page"');
  });

  it('renders nothing when there are no segments and no current', () => {
    expect(renderToStaticMarkup(<Breadcrumb segments={[]} />)).toBe('');
  });
});
