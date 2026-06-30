import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import { AuthDetails } from './AuthDetails';
import { AUTH_MODE_LABELS } from '../../constants';

const renderAuth = (ui: React.ReactElement) => {
  const html = renderToStaticMarkup(ui);
  const root = parse(html);
  // Strip emotion's inline <style> blocks so their CSS text never counts as content.
  root.querySelectorAll('style').forEach((style) => style.remove());
  const getByTestId = (testId: string) => {
    const element = root.querySelector(`[data-testid="${testId}"]`);
    if (!element) throw new Error(`No element with data-testid="${testId}"`);
    return element;
  };
  return { html, getByTestId };
};

describe('AuthDetails', () => {
  it('renders basic auth: mode + username, masks the password', () => {
    const { getByTestId, html } = renderAuth(
      <AuthDetails
        auth={{ type: 'basic', username: 'user@example.com', password: 's3cr3t' }}
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId('auth-mode').text.trim()).toBe('Basic Auth');
    expect(getByTestId('auth-username').text.trim()).toBe('user@example.com');
    expect(getByTestId('auth-password').text).toMatch(/•/);
    expect(getByTestId('auth-password').text).not.toContain('s3cr3t');
    expect(html).not.toContain('s3cr3t');
  });

  it('masks the bearer token and falls back to the raw type without a label', () => {
    const { getByTestId, html } = renderAuth(<AuthDetails auth={{ type: 'bearer', token: 'abc123' }} testId="auth" />);
    expect(getByTestId('auth-mode').text.trim()).toBe('bearer');
    expect(getByTestId('auth-token').text).toMatch(/•/);
    expect(getByTestId('auth-token').text).not.toContain('abc123');
    expect(html).not.toContain('abc123');
  });

  it('renders apikey fields including placement', () => {
    const { getByTestId } = renderAuth(
      <AuthDetails
        auth={{ type: 'apikey', key: 'X-Api-Key', value: 'k', placement: 'header' }}
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId('auth-mode').text.trim()).toBe('API Key');
    expect(getByTestId('auth-key').text.trim()).toBe('X-Api-Key');
    expect(getByTestId('auth-add-to').text.trim()).toBe('header');
  });

  it('shows the empty message when there is no auth', () => {
    const { getByTestId } = renderAuth(<AuthDetails emptyMessage="No authentication configured" testId="auth" />);
    expect(getByTestId('auth-empty').text.trim()).toBe('No authentication configured');
  });
});
