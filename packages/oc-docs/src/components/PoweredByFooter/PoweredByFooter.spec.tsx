import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import PoweredByFooter from './PoweredByFooter';

const render = () => renderToStaticMarkup(<PoweredByFooter />);

describe('PoweredByFooter', () => {
  it('renders the Powered by attribution', () => {
    expect(render()).toContain('Powered by');
  });

  it('links opencollection to opencollection.com', () => {
    const html = render();
    expect(html).toContain('opencollection');
    expect(html).toContain('href="https://opencollection.com"');
  });
});
