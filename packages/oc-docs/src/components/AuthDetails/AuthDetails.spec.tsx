import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import { AuthDetails } from './AuthDetails';
import { AUTH_MODE_LABELS } from '@constants';
import { SECRET_MASK } from '@constants';

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
    expect(getByTestId('auth-password').text.trim()).toBe(SECRET_MASK);
    expect(html).not.toContain('s3cr3t');
  });

  it('masks the bearer token and falls back to the raw type without a label', () => {
    const { getByTestId, html } = renderAuth(<AuthDetails auth={{ type: 'bearer', token: 'abc123' }} testId="auth" />);
    expect(getByTestId('auth-mode').text.trim()).toBe('bearer');
    expect(getByTestId('auth-token').text.trim()).toBe(SECRET_MASK);
    expect(html).not.toContain('abc123');
  });

  it('renders apikey fields and humanizes the placement', () => {
    const { getByTestId } = renderAuth(
      <AuthDetails
        auth={{ type: 'apikey', key: 'X-Api-Key', value: 'k', placement: 'header' }}
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId('auth-mode').text.trim()).toBe('API Key');
    expect(getByTestId('auth-key').text.trim()).toBe('X-Api-Key');
    expect(getByTestId('auth-add-to').text.trim()).toBe('Header');
  });

  it('humanizes a query-params placement', () => {
    const { getByTestId } = renderAuth(
      <AuthDetails
        auth={{ type: 'apikey', key: 'api_key', value: 'k', placement: 'query' }}
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId('auth-add-to').text.trim()).toBe('Query Params');
  });

  it('renders AWS Signature v4 fields and masks the secret + session token', () => {
    const { getByTestId, html } = renderAuth(
      <AuthDetails
        auth={{
          type: 'awsv4',
          accessKeyId: 'AKIAEXAMPLE',
          secretAccessKey: 'secretKeyValue',
          sessionToken: 'sessionTokenValue',
          service: 'execute-api',
          region: 'us-east-1',
          profileName: 'default'
        }}
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId('auth-mode').text.trim()).toBe('AWS Signature v4');
    expect(getByTestId('auth-access-key-id').text.trim()).toBe('AKIAEXAMPLE');
    expect(getByTestId('auth-service').text.trim()).toBe('execute-api');
    expect(getByTestId('auth-region').text.trim()).toBe('us-east-1');
    expect(getByTestId('auth-secret-access-key').text.trim()).toBe(SECRET_MASK);
    expect(getByTestId('auth-session-token').text.trim()).toBe(SECRET_MASK);
    expect(html).not.toContain('secretKeyValue');
    expect(html).not.toContain('sessionTokenValue');
  });

  it('renders the full oauth1 field set and masks the private key', () => {
    const { getByTestId, html } = renderAuth(
      <AuthDetails
        auth={{
          type: 'oauth1',
          consumerKey: 'ck',
          privateKey: { type: 'text', value: 'pem-secret' },
          verifier: 'v-code',
          timestamp: '1700000000',
          nonce: 'n-123',
          version: '1.0',
          realm: 'my-realm',
          includeBodyHash: true,
          placement: 'body'
        }}
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId('auth-verifier').text.trim()).toBe('v-code');
    expect(getByTestId('auth-nonce').text.trim()).toBe('n-123');
    expect(getByTestId('auth-realm').text.trim()).toBe('my-realm');
    expect(getByTestId('auth-include-body-hash').text.trim()).toBe('Yes');
    expect(getByTestId('auth-placement').text.trim()).toBe('Body');
    expect(getByTestId('auth-private-key').text.trim()).toBe(SECRET_MASK);
    expect(html).not.toContain('pem-secret');
  });

  it('renders oauth2 authorization-code details: refresh url, state, pkce, token config, settings', () => {
    const { getByTestId } = renderAuth(
      <AuthDetails
        auth={{
          type: 'oauth2',
          flow: 'authorization_code',
          authorizationUrl: 'https://auth',
          accessTokenUrl: 'https://token',
          refreshTokenUrl: 'https://refresh',
          state: 'xyz',
          scope: 'read write',
          credentials: { clientId: 'cid', clientSecret: 'csecret', placement: 'basic_auth_header' },
          pkce: { method: 'S256' },
          tokenConfig: { source: 'id_token', placement: { header: 'Authorization' } },
          settings: { autoFetchToken: true, autoRefreshToken: false }
        }}
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId('auth-flow').text.trim()).toBe('Authorization Code');
    expect(getByTestId('auth-refresh-token-url').text.trim()).toBe('https://refresh');
    expect(getByTestId('auth-state').text.trim()).toBe('xyz');
    expect(getByTestId('auth-pkce').text.trim()).toBe('S256');
    expect(getByTestId('auth-add-credentials-to').text.trim()).toBe('Basic Auth Header');
    expect(getByTestId('auth-token-source').text.trim()).toBe('ID Token');
    expect(getByTestId('auth-token-placement').text.trim()).toBe('Header (Authorization)');
    expect(getByTestId('auth-auto-fetch-token').text.trim()).toBe('Yes');
    expect(getByTestId('auth-auto-refresh-token').text.trim()).toBe('No');
  });

  it('renders oauth2 additional parameters grouped by request phase', () => {
    const { getByTestId } = renderAuth(
      <AuthDetails
        auth={
          {
            type: 'oauth2',
            flow: 'authorization_code',
            accessTokenUrl: 'https://token',
            additionalParameters: {
              authorizationRequest: [{ name: 'audience', value: 'https://api', placement: 'query' }],
              accessTokenRequest: [{ name: 'resource', value: 'r1', placement: 'body' }]
            }
          } as any
        }
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    const audience = getByTestId('auth-additional-param-authorizationRequest-0');
    const audienceRow = audience.parentNode;
    expect(audience.text.trim()).toBe('https://api');
    expect(audienceRow.querySelector('.property-key')?.text.trim()).toBe('audience');
    expect(audienceRow.querySelector('.description')?.text.trim()).toBe('Authorization Request · Query Params');

    const resource = getByTestId('auth-additional-param-accessTokenRequest-0');
    const resourceRow = resource.parentNode;
    expect(resource.text.trim()).toBe('r1');
    expect(resourceRow.querySelector('.property-key')?.text.trim()).toBe('resource');
    expect(resourceRow.querySelector('.description')?.text.trim()).toBe('Access Token Request · Body');
  });

  it('renders Akamai EdgeGrid auth and masks the secret credentials', () => {
    const { getByTestId, html } = renderAuth(
      <AuthDetails
        auth={
          {
            type: 'akamai-edgegrid',
            accessToken: 'atValue',
            clientToken: 'ctValue',
            clientSecret: 'csValue',
            baseURL: 'https://akaa-base.luna.akamaiapis.net',
            nonce: 'n-1',
            timestamp: '20240101T00:00:00+0000',
            headersToSign: 'X-Custom',
            maxBodySize: 2048
          } as any
        }
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId('auth-mode').text.trim()).toBe('Akamai EdgeGrid');
    expect(getByTestId('auth-base-url').text.trim()).toBe('https://akaa-base.luna.akamaiapis.net');
    expect(getByTestId('auth-headers-to-sign').text.trim()).toBe('X-Custom');
    expect(getByTestId('auth-max-body-size').text.trim()).toBe('2048');
    expect(getByTestId('auth-access-token').text.trim()).toBe(SECRET_MASK);
    expect(getByTestId('auth-client-token').text.trim()).toBe(SECRET_MASK);
    expect(getByTestId('auth-client-secret').text.trim()).toBe(SECRET_MASK);
    expect(html).not.toContain('atValue');
    expect(html).not.toContain('ctValue');
    expect(html).not.toContain('csValue');
  });

  it('shows the empty message when there is no auth', () => {
    const { getByTestId } = renderAuth(<AuthDetails emptyMessage="No authentication configured" testId="auth" />);
    expect(getByTestId('auth-empty').text.trim()).toBe('No authentication configured');
  });
});
