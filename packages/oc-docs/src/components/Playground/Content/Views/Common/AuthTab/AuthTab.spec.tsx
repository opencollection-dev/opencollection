import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import { describe, it, expect } from 'vitest';
import { getByTestId, query } from '../../../../../../test-utils/dom';
import { AUTH_DEFAULTS, AUTH_MODE_LABELS, PLACEMENT_OPTIONS } from '../../../../../../constants';
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
  it('offers exactly the four supported auth types and none of the unsupported ones', () => {
    const modeLabels = ['No Auth', ...Object.keys(AUTH_DEFAULTS).map((mode) => AUTH_MODE_LABELS[mode] ?? mode)];
    expect(modeLabels).toEqual(['No Auth', 'Basic Auth', 'Bearer Token', 'API Key']);
    ['digest', 'aws', 'signature', 'oauth', 'wsse', 'ntlm', 'edgegrid', 'akamai'].forEach((excluded) =>
      expect(modeLabels.join(' ').toLowerCase()).not.toContain(excluded)
    );
  });

  it('shows the current auth type on the mode trigger', () => {
    expect(renderAuth(undefined).getByTestId('auth-mode-select').text).toContain('No Auth');
    expect(renderAuth({ type: 'bearer', token: 'abc' }).getByTestId('auth-mode-select').text).toContain('Bearer Token');
  });

  it('offers Inherit as a mode only when showInherit is set', () => {
    // Enabled: inherit is selectable and shows on the trigger.
    expect(renderAuth('inherit', { showInherit: true }).getByTestId('auth-mode-select').text).toContain('Inherit');
    // Disabled: inherit is not an option, so nothing matches and the trigger shows no label.
    expect(renderAuth('inherit').getByTestId('auth-mode-select').text.trim()).toBe('');
  });

  it('renders no form for None', () => {
    const { root, byTestId } = renderAuth(undefined);
    expect(root.querySelector('.auth-form')).toBeNull();
    expect(byTestId('auth-username')).toBeNull();
    expect(getByTestId(root, 'no-content-text').text.trim()).toBe('No authentication configured.');
  });

  it('shows an inherit note for inherited auth', () => {
    const { root } = renderAuth('inherit', { showInherit: true });
    expect(getByTestId(root, 'no-content-text').text.trim()).toBe('Inherits auth from parent collection.');
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
    expect(PLACEMENT_OPTIONS.map((option) => option.label)).toEqual(['Header', 'Query Params']);
    expect(getByTestId('auth-placement').text).toContain('Query Params');
  });

  it('defaults the apikey placement to Header when none is stored', () => {
    const { getByTestId } = renderAuth({ type: 'apikey', key: '', value: '' });
    expect(getByTestId('auth-placement').text).toContain('Header');
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
