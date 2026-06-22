import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { AuthDetails } from './AuthDetails';
import { AUTH_MODE_LABELS } from '../../constants';

describe('AuthDetails', () => {
  it('renders basic auth: mode + username, masks the password', () => {
    const html = renderToStaticMarkup(
      <AuthDetails
        auth={{ type: 'basic', username: 'user@example.com', password: 's3cr3t' }}
        authModeLabels={AUTH_MODE_LABELS}
      />
    );
    expect(html).toContain('Basic Auth');
    expect(html).toContain('user@example.com');
    expect(html).not.toContain('s3cr3t');
  });

  it('masks the bearer token and falls back to the raw type without a label', () => {
    const html = renderToStaticMarkup(<AuthDetails auth={{ type: 'bearer', token: 'abc123' }} />);
    expect(html).toContain('bearer');
    expect(html).not.toContain('abc123');
  });

  it('renders apikey fields including placement', () => {
    const html = renderToStaticMarkup(
      <AuthDetails
        auth={{ type: 'apikey', key: 'X-Api-Key', value: 'k', placement: 'header' }}
        authModeLabels={AUTH_MODE_LABELS}
      />
    );
    expect(html).toContain('API Key');
    expect(html).toContain('X-Api-Key');
    expect(html).toContain('header');
  });

  it('shows the empty message when there is no auth', () => {
    const html = renderToStaticMarkup(<AuthDetails emptyMessage="No authentication configured" />);
    expect(html).toContain('No authentication configured');
  });
});
