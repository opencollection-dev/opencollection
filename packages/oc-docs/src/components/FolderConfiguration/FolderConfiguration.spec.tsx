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
  variables: []
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
});
