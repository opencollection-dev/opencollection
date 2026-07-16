import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import { getByTestId } from '../../test-utils/dom';
import { AuthDetails } from './AuthDetails';
import { AUTH_MODE_LABELS } from '../../constants';
import { SECRET_MASK } from '../../constants';

const renderAuth = (ui: React.ReactElement) => {
  const html = renderToStaticMarkup(ui);
  const root = parse(html);
  // Strip emotion's inline <style> blocks so their CSS text never counts as content.
  root.querySelectorAll('style').forEach((style) => style.remove());
  return { html, root };
};

describe('AuthDetails', () => {
  it('renders basic auth: mode + username, masks the password', () => {
    const { root, html } = renderAuth(
      <AuthDetails
        auth={{ type: 'basic', username: 'user@example.com', password: 's3cr3t' }}
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId(root, 'auth-mode').text.trim()).toBe('Basic Auth');
    expect(getByTestId(root, 'auth-username').text.trim()).toBe('user@example.com');
    expect(getByTestId(root, 'auth-password').text.trim()).toBe(SECRET_MASK);
    expect(html).not.toContain('s3cr3t');
  });

  it('masks the bearer token and falls back to the raw type without a label', () => {
    const { root, html } = renderAuth(<AuthDetails auth={{ type: 'bearer', token: 'abc123' }} testId="auth" />);
    expect(getByTestId(root, 'auth-mode').text.trim()).toBe('bearer');
    expect(getByTestId(root, 'auth-token').text.trim()).toBe(SECRET_MASK);
    expect(html).not.toContain('abc123');
  });

  it('renders apikey fields and humanizes the placement', () => {
    const { root } = renderAuth(
      <AuthDetails
        auth={{ type: 'apikey', key: 'X-Api-Key', value: 'k', placement: 'header' }}
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId(root, 'auth-mode').text.trim()).toBe('API Key');
    expect(getByTestId(root, 'auth-key').text.trim()).toBe('X-Api-Key');
    expect(getByTestId(root, 'auth-add-to').text.trim()).toBe('Header');
  });

  it('humanizes a query-params placement', () => {
    const { root } = renderAuth(
      <AuthDetails
        auth={{ type: 'apikey', key: 'api_key', value: 'k', placement: 'query' }}
        authModeLabels={AUTH_MODE_LABELS}
        testId="auth"
      />
    );
    expect(getByTestId(root, 'auth-add-to').text.trim()).toBe('Query Params');
  });

  it('renders AWS Signature v4 fields and masks the secret + session token', () => {
    const { root, html } = renderAuth(
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
    expect(getByTestId(root, 'auth-mode').text.trim()).toBe('AWS Signature v4');
    expect(getByTestId(root, 'auth-access-key-id').text.trim()).toBe('AKIAEXAMPLE');
    expect(getByTestId(root, 'auth-service').text.trim()).toBe('execute-api');
    expect(getByTestId(root, 'auth-region').text.trim()).toBe('us-east-1');
    expect(getByTestId(root, 'auth-secret-access-key').text.trim()).toBe(SECRET_MASK);
    expect(getByTestId(root, 'auth-session-token').text.trim()).toBe(SECRET_MASK);
    expect(html).not.toContain('secretKeyValue');
    expect(html).not.toContain('sessionTokenValue');
  });

  it('renders the full oauth1 field set and masks the private key', () => {
    const { root, html } = renderAuth(
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
    expect(getByTestId(root, 'auth-verifier').text.trim()).toBe('v-code');
    expect(getByTestId(root, 'auth-nonce').text.trim()).toBe('n-123');
    expect(getByTestId(root, 'auth-realm').text.trim()).toBe('my-realm');
    expect(getByTestId(root, 'auth-include-body-hash').text.trim()).toBe('Yes');
    expect(getByTestId(root, 'auth-placement').text.trim()).toBe('Body');
    expect(getByTestId(root, 'auth-private-key').text.trim()).toBe(SECRET_MASK);
    expect(html).not.toContain('pem-secret');
  });

  it('renders oauth2 authorization-code details: refresh url, state, pkce, token config, settings', () => {
    const { root } = renderAuth(
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
    expect(getByTestId(root, 'auth-flow').text.trim()).toBe('Authorization Code');
    expect(getByTestId(root, 'auth-refresh-token-url').text.trim()).toBe('https://refresh');
    expect(getByTestId(root, 'auth-state').text.trim()).toBe('xyz');
    expect(getByTestId(root, 'auth-pkce').text.trim()).toBe('S256');
    expect(getByTestId(root, 'auth-add-credentials-to').text.trim()).toBe('Basic Auth Header');
    expect(getByTestId(root, 'auth-token-source').text.trim()).toBe('ID Token');
    expect(getByTestId(root, 'auth-token-placement').text.trim()).toBe('Header (Authorization)');
    expect(getByTestId(root, 'auth-auto-fetch-token').text.trim()).toBe('Yes');
    expect(getByTestId(root, 'auth-auto-refresh-token').text.trim()).toBe('No');
  });

  it('renders oauth2 additional parameters grouped by request phase', () => {
    const { root } = renderAuth(
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
    const audience = getByTestId(root, 'auth-additional-param-authorizationRequest-0');
    const audienceRow = audience.parentNode;
    expect(audience.text.trim()).toBe('https://api');
    expect(audienceRow.querySelector('.property-key')?.text.trim()).toBe('audience');
    expect(audienceRow.querySelector('.description')?.text.trim()).toBe('Authorization Request · Query Params');

    const resource = getByTestId(root, 'auth-additional-param-accessTokenRequest-0');
    const resourceRow = resource.parentNode;
    expect(resource.text.trim()).toBe('r1');
    expect(resourceRow.querySelector('.property-key')?.text.trim()).toBe('resource');
    expect(resourceRow.querySelector('.description')?.text.trim()).toBe('Access Token Request · Body');
  });

  it('renders Akamai EdgeGrid auth and masks the secret credentials', () => {
    const { root, html } = renderAuth(
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
    expect(getByTestId(root, 'auth-mode').text.trim()).toBe('Akamai EdgeGrid');
    expect(getByTestId(root, 'auth-base-url').text.trim()).toBe('https://akaa-base.luna.akamaiapis.net');
    expect(getByTestId(root, 'auth-headers-to-sign').text.trim()).toBe('X-Custom');
    expect(getByTestId(root, 'auth-max-body-size').text.trim()).toBe('2048');
    expect(getByTestId(root, 'auth-access-token').text.trim()).toBe(SECRET_MASK);
    expect(getByTestId(root, 'auth-client-token').text.trim()).toBe(SECRET_MASK);
    expect(getByTestId(root, 'auth-client-secret').text.trim()).toBe(SECRET_MASK);
    expect(html).not.toContain('atValue');
    expect(html).not.toContain('ctValue');
    expect(html).not.toContain('csValue');
  });

  it('shows the empty message when there is no auth', () => {
    const { root } = renderAuth(<AuthDetails emptyMessage="No authentication configured" testId="auth" />);
    expect(getByTestId(root, 'auth-empty').text.trim()).toBe('No authentication configured');
  });
});
