import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import { Overview } from './Overview';

describe('Overview', () => {
  it('renders the headline, stats, environments, docs and configuration', () => {
    const collection: OpenCollection = {
      info: { name: 'Hotel Booking API', version: '1.0.0' },
      config: { environments: [{ name: 'Development', variables: [{ name: 'baseUrl', value: 'x' }] }] },
      request: { headers: [{ name: 'Accept', value: 'application/json' }] },
      docs: '# Getting started\nUse this API.'
    };

    const html = renderToStaticMarkup(<Overview collection={collection} />);

    expect(html).toContain('Hotel Booking API');
    expect(html).toContain('v1.0.0'); // version is "v"-prefixed for display
    expect(html).toContain('Development');
    expect(html).toContain('1 variable');
    expect(html).toContain('Accept');
    expect(html).toContain('application/json');
    expect(html).toContain('Getting started'); // collection docs rendered
    expect(html).toContain('Collection Configuration');
  });

  it('renders an empty-state placeholder for each section when the collection is bare', () => {
    const collection: OpenCollection = {
      info: { name: 'Empty API', version: '1.0.0' }
    };

    const html = renderToStaticMarkup(<Overview collection={collection} />);

    expect(html).toContain('No environments yet');
    expect(html).toContain('No overview content yet');
    expect(html).toContain('No configuration set');
  });
});
