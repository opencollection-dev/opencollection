import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { HttpRequestHeader } from '@opencollection/types/requests/http';
import { CollectionConfiguration } from './CollectionConfiguration';
import { AUTH_MODE_LABELS } from '../../constants';

describe('CollectionConfiguration', () => {
  it('renders nothing when there is no configuration', () => {
    const html = renderToStaticMarkup(<CollectionConfiguration />);
    expect(html).toBe('');
  });

  it('renders enabled headers, masks secret auth values and shows script/test code', () => {
    const headers: HttpRequestHeader[] = [
      { name: 'Accept', value: 'application/json' },
      { name: 'X-Disabled', value: 'nope', disabled: true }
    ];

    const html = renderToStaticMarkup(
      <CollectionConfiguration
        headers={headers}
        auth={{ type: 'basic', username: 'user@example.com', password: 's3cr3t' }}
        scripts={{ preRequest: 'console.log("pre")', tests: 'test("ok", () => {})' }}
        authModeLabels={AUTH_MODE_LABELS}
      />
    );

    // Enabled headers shown, disabled ones filtered out
    expect(html).toContain('Accept');
    expect(html).toContain('application/json');
    expect(html).not.toContain('X-Disabled');

    // Auth mode resolved via the supplied labels; username shown, password masked
    expect(html).toContain('Basic Auth');
    expect(html).toContain('user@example.com');
    expect(html).not.toContain('s3cr3t');

    // Script and test sections render
    expect(html).toContain('Pre-Request');
    expect(html).toContain('Tests');
  });

  it('falls back to the raw auth type when no label is supplied', () => {
    const html = renderToStaticMarkup(<CollectionConfiguration auth={{ type: 'bearer', token: 't' }} />);
    expect(html).toContain('bearer');
  });

  it('shows an empty hint for each subsection that has no items (when some config exists)', () => {
    const html = renderToStaticMarkup(<CollectionConfiguration auth={{ type: 'bearer', token: 't' }} />);
    expect(html).toContain('Add headers to inherit in all requests in the collection');
    expect(html).toContain('Add scripts to run for all requests in the collection');
    expect(html).toContain('Add tests to run for all requests in the collection');
    expect(html).toContain('bearer');
    expect(html).toContain('3 hidden sections');
    expect(html).toContain('hidden-sections');
  });
});
