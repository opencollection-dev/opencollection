import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../../../../../hooks/useRenderToDom';
import { AuthTab } from '.';

const noop = () => {};

describe('AuthTab', () => {
  it('renders basic auth username and a masked password field', () => {
    const root = useRenderToDom(
      <AuthTab
        auth={{ type: 'basic', username: 'user@example.com', password: 's3cr3t' }}
        onAuthChange={noop}
        onItemChange={noop}
        item={{}}
        title=""
        showFullAuth
      />
    );
    const labels = root.querySelectorAll('label').map((label) => label.text.trim());
    expect(labels).toContain('Username');
    expect(labels).toContain('Password');
    const inputs = root.querySelectorAll('input');
    expect(inputs.some((input) => input.getAttribute('type') === 'password')).toBe(true);
    expect(inputs.some((input) => input.getAttribute('value') === 'user@example.com')).toBe(true);
  });

  it('renders the six AWS Signature v4 fields', () => {
    const root = useRenderToDom(
      <AuthTab auth={{ type: 'awsv4' }} onAuthChange={noop} onItemChange={noop} item={{}} title="" showFullAuth />
    );
    const labels = root.querySelectorAll('label').map((label) => label.text.trim());
    expect(labels).toContain('Access Key');
    expect(labels).toContain('Secret Key');
    expect(labels).toContain('Session Token');
    expect(labels).toContain('Service');
    expect(labels).toContain('Region');
    expect(labels).toContain('Profile');
  });

  it('renders the OAuth 2.0 editor with a Grant Type control', () => {
    const root = useRenderToDom(
      <AuthTab
        auth={{ type: 'oauth2', flow: 'authorization_code' }}
        onAuthChange={noop}
        onItemChange={noop}
        item={{}}
        title=""
        showFullAuth
      />
    );
    const labels = root.querySelectorAll('label').map((label) => label.text.trim());
    expect(labels).toContain('Grant Type');
  });

  it('renders the NTLM Domain field', () => {
    const root = useRenderToDom(
      <AuthTab auth={{ type: 'ntlm' }} onAuthChange={noop} onItemChange={noop} item={{}} title="" showFullAuth />
    );
    const labels = root.querySelectorAll('label').map((label) => label.text.trim());
    expect(labels).toContain('Username');
    expect(labels).toContain('Password');
    expect(labels).toContain('Domain');
  });
});
