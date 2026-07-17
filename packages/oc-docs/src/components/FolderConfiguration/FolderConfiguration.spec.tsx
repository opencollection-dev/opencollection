import React from 'react';
import { describe, it, expect } from 'vitest';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { FolderConfiguration } from './FolderConfiguration';
import type { FolderConfig } from '../../utils/folder';

const baseConfig: FolderConfig = {
  headers: [],
  auth: undefined,
  authSource: undefined,
  preRequest: undefined,
  postResponse: undefined,
  tests: undefined,
  variables: [],
  postVariables: []
};

describe('FolderConfiguration', () => {
  it('shows only the groups that have content and omits the empty ones', () => {
    const config: FolderConfig = {
      ...baseConfig,
      headers: [{ name: 'Accept', value: 'application/json' }],
      preRequest: 'console.log(1)'
    };
    const root = useRenderToDom(<FolderConfiguration config={config} />);

    expect(root.querySelector('[data-testid="folder-config-headers"]')).toBeTruthy();
    expect(root.querySelector('[data-testid="folder-config-script"]')).toBeTruthy();
    expect(root.querySelector('[data-testid="folder-config-headers"] .property-key')?.text.trim()).toBe('Accept');

    expect(root.querySelector('[data-testid="folder-config-auth"]')).toBeNull();
    expect(root.querySelector('[data-testid="folder-config-vars"]')).toBeNull();
    expect(root.querySelector('[data-testid="folder-config-tests"]')).toBeNull();
  });

  it('labels the Auth group with an "Inherited from collection" badge when auth is inherited', () => {
    const config: FolderConfig = {
      ...baseConfig,
      auth: { type: 'bearer', token: 't' } as any,
      authSource: { level: 'collection', name: 'API' }
    };
    const root = useRenderToDom(<FolderConfiguration config={config} authModeLabels={{ bearer: 'Bearer Token' }} />);

    const authGroup = root.querySelector('[data-testid="folder-config-auth"]');
    expect(authGroup).toBeTruthy();
    expect(authGroup?.querySelector('.config-group-head')?.text).toContain('Inherited from collection');
  });

  it('renders Pre-Request and Post-Response script columns and a separate Tests group', () => {
    const config: FolderConfig = {
      ...baseConfig,
      preRequest: 'pre()',
      postResponse: 'post()',
      tests: 'test()'
    };
    const root = useRenderToDom(<FolderConfiguration config={config} />);

    const phases = root
      .querySelectorAll('[data-testid="folder-config-script"] .config-phase-label')
      .map((el) => el.text.trim());
    expect(phases).toEqual(['Pre-Request', 'Post-Response']);
    expect(root.querySelector('[data-testid="folder-config-tests"]')).toBeTruthy();
  });

  it('renders disabled headers with a Disabled chip and their descriptions', () => {
    const config: FolderConfig = {
      ...baseConfig,
      headers: [{ name: 'X-Debug', value: 'on', disabled: true, description: 'toggles debug logging' }]
    };
    const root = useRenderToDom(<FolderConfiguration config={config} />);

    const headers = root.querySelector('[data-testid="folder-config-headers"]');
    expect(headers).toBeTruthy();
    expect(headers?.querySelector('.property-key')?.text.trim()).toBe('X-Debug');
    expect(headers?.querySelector('.disabled-badge')).toBeTruthy();
    expect(headers?.text).toContain('toggles debug logging');
  });

  it('renders both Pre-Request and Post-Response variable columns', () => {
    const config: FolderConfig = {
      ...baseConfig,
      variables: [{ name: 'baseUrl', value: 'https://api.example.com' }],
      postVariables: [{ name: 'token', expression: 'res.body.token', scope: 'runtime' }]
    };
    const root = useRenderToDom(<FolderConfiguration config={config} />);

    const vars = root.querySelector('[data-testid="folder-config-vars"]');
    expect(vars).toBeTruthy();
    const phases = vars?.querySelectorAll('.config-phase-label').map((el) => el.text.trim());
    expect(phases).toEqual(['Pre-Request', 'Post-Response']);
    expect(vars?.text).toContain('baseUrl');
    expect(vars?.text).toContain('token');
    expect(vars?.text).toContain('res.body.token');
  });

  it('shows only the Post-Response column when there are no pre-request vars', () => {
    const config: FolderConfig = {
      ...baseConfig,
      postVariables: [{ name: 'sessionId', expression: 'res.body.id', scope: 'runtime' }]
    };
    const root = useRenderToDom(<FolderConfiguration config={config} />);

    const vars = root.querySelector('[data-testid="folder-config-vars"]');
    expect(vars).toBeTruthy();
    const phases = vars?.querySelectorAll('.config-phase-label').map((el) => el.text.trim());
    expect(phases).toEqual(['Post-Response']);
  });
});
