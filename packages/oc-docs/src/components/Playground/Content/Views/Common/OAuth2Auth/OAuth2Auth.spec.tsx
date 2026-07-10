import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import OAuth2Auth from '.';

const noop = () => {};

describe('OAuth2Auth', () => {
  it('renders the authorization_code flow with authorization URL, PKCE and state', () => {
    const root = useRenderToDom(
      <OAuth2Auth auth={{ type: 'oauth2', flow: 'authorization_code', credentials: { clientId: 'cid' } }} onChange={noop} />
    );
    const labels = root.querySelectorAll('label').map((l) => l.text.trim());
    expect(labels).toContain('Grant Type');
    expect(labels).toContain('Authorization URL');
    expect(labels).toContain('Access Token URL');
    expect(labels).toContain('Callback URL');
    expect(labels).toContain('Use PKCE');
    expect(labels).toContain('State');
  });

  it('renders the client_credentials flow without authorization-only fields', () => {
    const root = useRenderToDom(<OAuth2Auth auth={{ type: 'oauth2', flow: 'client_credentials' }} onChange={noop} />);
    const labels = root.querySelectorAll('label').map((l) => l.text.trim());
    expect(labels).toContain('Access Token URL');
    expect(labels).not.toContain('Authorization URL');
    expect(labels).not.toContain('Use PKCE');
  });

  it('renders resource-owner username and password fields for the password flow', () => {
    const root = useRenderToDom(
      <OAuth2Auth auth={{ type: 'oauth2', flow: 'resource_owner_password_credentials' }} onChange={noop} />
    );
    const labels = root.querySelectorAll('label').map((l) => l.text.trim());
    expect(labels).toContain('Username');
    expect(labels).toContain('Password');
    expect(labels).toContain('Access Token URL');
  });

  it('renders the implicit flow without token URLs or a client secret', () => {
    const root = useRenderToDom(<OAuth2Auth auth={{ type: 'oauth2', flow: 'implicit' }} onChange={noop} />);
    const labels = root.querySelectorAll('label').map((l) => l.text.trim());
    expect(labels).toContain('Authorization URL');
    expect(labels).not.toContain('Access Token URL');
    expect(labels).not.toContain('Client Secret');
  });

  it('renders the additional-parameters editor with an add control', () => {
    const root = useRenderToDom(
      <OAuth2Auth
        auth={{
          type: 'oauth2',
          flow: 'authorization_code',
          additionalParameters: { authorizationRequest: [{ name: 'audience', value: 'https://api', placement: 'query' }] }
        }}
        onChange={noop}
      />
    );
    expect(root.querySelector('.param-row')?.text.trim()).toBe('Authorization request params');
    const values = root.querySelectorAll('.param-input').map((el) => el.getAttribute('value'));
    expect(values).toContain('audience');
    expect(values).toContain('https://api');
    expect(root.querySelector('.param-add')?.text.trim()).toBe('+ Add parameter');
  });
});
