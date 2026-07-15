import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import { query } from '../../../../../../test-utils/dom';
import { AuthTab } from './AuthTab';

const render = (ui: React.ReactElement) => {
  const root = parse(renderToStaticMarkup(ui));
  root.querySelectorAll('style').forEach((style) => style.remove());
  const byTestId = (testId: string) => root.querySelector(`[data-testid="${testId}"]`);
  const getByTestId = (testId: string) => {
    const el = byTestId(testId);
    if (!el) throw new Error(`No element with data-testid="${testId}"`);
    return el;
  };
  return { root, byTestId, getByTestId };
};

const noop = () => {};

const renderAuth = (auth: unknown, extra: Record<string, unknown> = {}) =>
  render(<AuthTab auth={auth} onAuthChange={noop} showFullAuth item={{ request: {} }} onItemChange={noop} {...extra} />);

describe('AuthTab', () => {
  it('offers exactly the six supported auth types and none of the unsupported ones', () => {
    const { getByTestId } = renderAuth(undefined);
    const options = getByTestId('auth-mode-select')
      .querySelectorAll('option')
      .map((o) => o.text.trim());
    expect(options).toEqual(['No Auth', 'Basic Auth', 'Bearer Token', 'API Key', 'Digest Auth', 'AWS Signature v4']);
    ['oauth', 'wsse', 'ntlm', 'edgegrid', 'akamai'].forEach((excluded) =>
      expect(options.join(' ').toLowerCase()).not.toContain(excluded)
    );
  });

  it('adds the Inherit option only when showInherit is set', () => {
    const withInherit = renderAuth(undefined, { showInherit: true })
      .getByTestId('auth-mode-select')
      .querySelectorAll('option')
      .map((o) => o.text.trim());
    expect(withInherit).toContain('Inherit');
    const without = renderAuth(undefined)
      .getByTestId('auth-mode-select')
      .querySelectorAll('option')
      .map((o) => o.text.trim());
    expect(without).not.toContain('Inherit');
  });

  it('renders no form for None', () => {
    const { root, byTestId } = renderAuth(undefined);
    expect(root.querySelector('.auth-form')).toBeNull();
    expect(byTestId('auth-username')).toBeNull();
    expect(query(root, '.auth-empty').text.trim()).toBe('No authentication configured.');
  });

  it('shows an inherit note for inherited auth', () => {
    const { root } = renderAuth('inherit', { showInherit: true });
    expect(query(root, '.auth-empty').text.trim()).toBe('Inherits auth from parent collection.');
  });

  it('renders basic auth with a plain username and a masked, revealable password', () => {
    const { getByTestId } = renderAuth({ type: 'basic', username: 'admin', password: 's3cr3t' });
    expect(getByTestId('auth-username').getAttribute('type')).toBe('text');
    expect(getByTestId('auth-username').getAttribute('value')).toBe('admin');
    expect(getByTestId('auth-password').getAttribute('type')).toBe('password');
    expect(getByTestId('auth-password-toggle').getAttribute('aria-label')).toBe('Show value');
  });

  it('masks the bearer token and exposes a reveal toggle', () => {
    const { getByTestId } = renderAuth({ type: 'bearer', token: 'abc' });
    expect(getByTestId('auth-token').getAttribute('type')).toBe('password');
    expect(getByTestId('auth-token-toggle')).toBeTruthy();
  });

  it('renders apikey with an unmasked value and a header/query placement select', () => {
    const { getByTestId } = renderAuth({ type: 'apikey', key: 'X-Api-Key', value: 'k', placement: 'query' });
    expect(getByTestId('auth-key').getAttribute('type')).toBe('text');
    expect(getByTestId('auth-value').getAttribute('type')).toBe('text');
    const placement = getByTestId('auth-placement');
    expect(placement.querySelectorAll('option').map((o) => o.text.trim())).toEqual(['Header', 'Query Params']);
    expect(query(placement, 'option[selected]').text.trim()).toBe('Query Params');
  });

  it('defaults the apikey placement to Header when none is stored', () => {
    const { getByTestId } = renderAuth({ type: 'apikey', key: '', value: '' });
    expect(query(getByTestId('auth-placement'), 'option[selected]').text.trim()).toBe('Header');
  });

  it('renders digest auth with a masked, revealable password', () => {
    const { getByTestId } = renderAuth({ type: 'digest', username: 'u', password: 'p' });
    expect(getByTestId('auth-username').getAttribute('type')).toBe('text');
    expect(getByTestId('auth-password').getAttribute('type')).toBe('password');
    expect(getByTestId('auth-password-toggle')).toBeTruthy();
  });

  it('renders all six AWS Signature v4 fields, masking only the secret access key', () => {
    const { getByTestId, byTestId } = renderAuth({ type: 'awsv4' });
    const labels = ['accessKeyId', 'secretAccessKey', 'sessionToken', 'service', 'region', 'profileName'];
    labels.forEach((field) => expect(byTestId(`auth-${field}`)).toBeTruthy());
    expect(getByTestId('auth-secretAccessKey').getAttribute('type')).toBe('password');
    expect(getByTestId('auth-secretAccessKey-toggle')).toBeTruthy();
    ['accessKeyId', 'sessionToken', 'service', 'region', 'profileName'].forEach((field) => {
      expect(getByTestId(`auth-${field}`).getAttribute('type')).toBe('text');
      expect(byTestId(`auth-${field}-toggle`)).toBeNull();
    });
  });

  it('uses the exact AWS field labels from Bruno', () => {
    const { root } = renderAuth({ type: 'awsv4' });
    const labels = root.querySelectorAll('.oc-label').map((l) => l.text.trim());
    expect(labels).toEqual(['Access Key ID', 'Secret Access Key', 'Session Token', 'Service', 'Region', 'AWS CLI Profile Name']);
  });
});
