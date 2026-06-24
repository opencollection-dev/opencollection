import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Stat } from './Stat';

describe('Stat', () => {
  it('renders the value and label', () => {
    const html = renderToStaticMarkup(<Stat label="Requests" value={30} />);
    expect(html).toContain('30');
    expect(html).toContain('Requests');
  });
});
