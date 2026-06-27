import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import { Environments } from './Environments';

describe('Environments', () => {
  it('renders a tab per environment and the active environment variable table', () => {
    const collection: OpenCollection = {
      info: { name: 'Hotel Booking API', version: '1.0.0' },
      config: {
        environments: [
          {
            name: 'Development',
            color: '#16a34a',
            variables: [
              { name: 'baseUrl', value: 'https://api.dev' },
              { name: 'authToken', secret: true, type: 'string' }
            ]
          },
          { name: 'Prod', variables: [{ name: 'baseUrl', value: 'https://api.prod' }] }
        ]
      }
    };

    const html = renderToStaticMarkup(<Environments collection={collection} />);

    expect(html).toContain('Environments');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('Development');
    expect(html).toContain('Prod');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain('Variables');
    expect(html).toContain('Secret Variables');
    expect(html).toContain('baseUrl');
    expect(html).toContain('https://api.dev');
    expect(html).toContain('Secret');
  });

  it('renders an external secret variables section with the manager label', () => {
    const collection = {
      info: { name: 'API', version: '1.0.0' },
      config: {
        environments: [
          {
            name: 'Prod',
            variables: [{ name: 'baseUrl', value: 'https://api.prod' }],
            externalSecrets: {
              type: 'aws-secrets-manager',
              variables: [{ name: 'dbPassword', secretName: 'prod/db/credentials', enabled: true }]
            }
          }
        ]
      }
    } as unknown as OpenCollection;

    const html = renderToStaticMarkup(<Environments collection={collection} />);

    expect(html).toContain('External Secret Variables');
    expect(html).toContain('AWS Secrets Manager');
    expect(html).toContain('dbPassword');
    expect(html).toContain('prod/db/credentials');
  });

  it('omits sections that have no entries', () => {
    const collection: OpenCollection = {
      info: { name: 'API', version: '1.0.0' },
      config: { environments: [{ name: 'Dev', variables: [{ name: 'baseUrl', value: 'x' }] }] }
    };

    const html = renderToStaticMarkup(<Environments collection={collection} />);

    expect(html).toContain('Variables');
    expect(html).not.toContain('Secret Variables');
    expect(html).not.toContain('External Secret Variables');
  });

  it('shows "(empty)" for both the value and the data type when a variable has no value', () => {
    const collection: OpenCollection = {
      info: { name: 'API', version: '1.0.0' },
      config: { environments: [{ name: 'Dev', variables: [{ name: 'transactionId', value: '' }] }] }
    };

    const html = renderToStaticMarkup(<Environments collection={collection} />);
    const matches = html.match(/\(empty\)/g) ?? [];
    expect(matches.length).toBe(2);
  });

  it('renders an empty state when there are no environments', () => {
    const collection: OpenCollection = { info: { name: 'Empty API', version: '1.0.0' } };
    const html = renderToStaticMarkup(<Environments collection={collection} />);
    expect(html).toContain('No environments configured');
    expect(html).not.toContain('role="tablist"');
  });
});
