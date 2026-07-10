import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { SecretValue } from './SecretValue';
import { SECRET_MASK } from '../../constants';

describe('SecretValue', () => {
  it('masks the value by default and never renders the real value', () => {
    const html = renderToStaticMarkup(<SecretValue value="s3cr3t-token" />);
    expect(html).not.toContain('s3cr3t-token');
    expect(html).toContain(SECRET_MASK);
  });

  it('renders a reveal toggle button by default', () => {
    const html = renderToStaticMarkup(<SecretValue value="s3cr3t-token" testId="secret" />);
    expect(html).toContain('data-testid="secret-toggle"');
  });

  it('is display-only when readOnly: masked, no toggle button', () => {
    const html = renderToStaticMarkup(<SecretValue value="s3cr3t-token" readOnly testId="secret" />);
    expect(html).toContain(SECRET_MASK);
    expect(html).not.toContain('s3cr3t-token');
    expect(html).not.toContain('<button');
    expect(html).not.toContain('data-testid="secret-toggle"');
  });
});
