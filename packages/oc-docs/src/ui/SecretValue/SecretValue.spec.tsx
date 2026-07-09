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

  it('is an editable, masked, read-only-until-revealed input when onChange is given', () => {
    const html = renderToStaticMarkup(<SecretValue value="s3cr3t-token" onChange={() => undefined} testId="secret" />);
    expect(html).toContain('data-testid="secret-input"');
    expect(html).toContain('type="password"');
    expect(html).toContain('readonly');
    expect(html).toContain('data-testid="secret-toggle"');
  });

  it('stays display-only when readOnly even if onChange is passed', () => {
    const html = renderToStaticMarkup(<SecretValue value="s3cr3t-token" readOnly onChange={() => undefined} testId="secret" />);
    expect(html).not.toContain('data-testid="secret-input"');
    expect(html).toContain(SECRET_MASK);
  });
});
