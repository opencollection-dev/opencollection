import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { SecretValue, SECRET_MASK } from './SecretValue';

describe('SecretValue', () => {
  it('masks the value by default and never renders the real value', () => {
    const html = renderToStaticMarkup(<SecretValue value="s3cr3t-token" />);
    expect(html).not.toContain('s3cr3t-token');
    expect(html).toContain(SECRET_MASK);
  });
});
