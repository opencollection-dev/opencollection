import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
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
    const html = renderToStaticMarkup(<FolderConfiguration config={config} />);
    expect(html).toContain('folder-config-headers');
    expect(html).toContain('folder-config-script');
    expect(html).toContain('Accept');
    expect(html).not.toContain('folder-config-auth');
    expect(html).not.toContain('folder-config-vars');
    expect(html).not.toContain('folder-config-tests');
  });

  it('labels the Auth group with an "Inherited from collection" badge when auth is inherited', () => {
    const config: FolderConfig = {
      ...baseConfig,
      auth: { type: 'bearer', token: 't' } as any,
      authSource: { level: 'collection', name: 'API' }
    };
    const html = renderToStaticMarkup(
      <FolderConfiguration config={config} authModeLabels={{ bearer: 'Bearer Token' }} />
    );
    expect(html).toContain('folder-config-auth');
    expect(html).toContain('Inherited from collection');
  });

  it('renders Pre-Request and Post-Response script columns and a separate Tests group', () => {
    const config: FolderConfig = {
      ...baseConfig,
      preRequest: 'pre()',
      postResponse: 'post()',
      tests: 'test()'
    };
    const html = renderToStaticMarkup(<FolderConfiguration config={config} />);
    expect(html).toContain('Pre-Request');
    expect(html).toContain('Post-Response');
    expect(html).toContain('folder-config-tests');
  });
});
