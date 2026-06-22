import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { RequestDescription } from './RequestDescription';

describe('RequestDescription', () => {
  it('renders the provided markdown html', () => {
    const html = renderToStaticMarkup(<RequestDescription html="<p>Authenticates a user.</p>" />);
    expect(html).toContain('Authenticates a user.');
  });

  it('renders nothing when there is no html', () => {
    expect(renderToStaticMarkup(<RequestDescription html="" />)).toBe('');
  });
});
