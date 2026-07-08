import React from 'react';
import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import { useRenderToDom } from '../../hooks/useRenderToDom';
import { Environments } from './Environments';

const groupLabels = (root: ReturnType<typeof useRenderToDom>) =>
  root.querySelectorAll('.table-group-label').map((el) => el.text.trim());

const cellText = (root: ReturnType<typeof useRenderToDom>, selector: string) =>
  root.querySelectorAll(selector).map((el) => el.text.trim());

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

    const root = useRenderToDom(<Environments collection={collection} />);

    expect(root.querySelector('[data-testid="environments-title"]')?.text.trim()).toBe('Environments');
    expect(root.querySelector('[role="tablist"]')).toBeTruthy();
    expect(root.querySelectorAll('[role="tab"]').map((t) => t.text.trim())).toEqual(['Development', 'Prod']);
    expect(root.querySelector('[role="tabpanel"]')).toBeTruthy();

    expect(groupLabels(root)).toEqual(['Variables', 'Secret Variables']);
    expect(cellText(root, '.environment-name')).toContain('baseUrl');
    expect(cellText(root, '.environment-value')).toContain('https://api.dev');
    expect(cellText(root, '.environment-name')).toContain('authToken');
    expect(root.querySelector('[data-testid="environment-secret-value"]')).toBeTruthy();
  });

  it('always shows a secret as a masked, display-only value (no value in the yml, no reveal toggle)', () => {
    const collection = {
      info: { name: 'API', version: '1.0.0' },
      config: {
        environments: [{ name: 'Dev', variables: [{ name: 'apiKey', secret: true }] }]
      }
    } as unknown as OpenCollection;

    const root = useRenderToDom(<Environments collection={collection} />);

    const secret = root.querySelector('[data-testid="environment-secret-value"]');
    expect(secret).toBeTruthy();
    expect(secret?.text).toContain('*');
    expect(secret?.querySelector('[data-testid="environment-secret-value-toggle"]')).toBeNull();
    expect(root.querySelector('[data-testid="environment-secret-value"].secret-value--readonly')).toBeTruthy();
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

    const root = useRenderToDom(<Environments collection={collection} />);

    expect(groupLabels(root)).toContain('External Secret Variables');
    expect(root.querySelector('.table-group-meta')?.text.trim()).toBe('AWS Secrets Manager');
    expect(cellText(root, '.environment-name')).toContain('dbPassword');
    expect(cellText(root, '.environment-value')).toContain('prod/db/credentials');
  });

  it('omits sections that have no entries', () => {
    const collection: OpenCollection = {
      info: { name: 'API', version: '1.0.0' },
      config: { environments: [{ name: 'Dev', variables: [{ name: 'baseUrl', value: 'x' }] }] }
    };

    const root = useRenderToDom(<Environments collection={collection} />);
    expect(groupLabels(root)).toEqual(['Variables']);
  });

  it('shows "(empty)" for both the value and the data type when a variable has no value', () => {
    const collection: OpenCollection = {
      info: { name: 'API', version: '1.0.0' },
      config: { environments: [{ name: 'Dev', variables: [{ name: 'transactionId', value: '' }] }] }
    };

    const root = useRenderToDom(<Environments collection={collection} />);
    expect(root.querySelectorAll('.environment-empty').length).toBe(2);
  });

  it('renders an empty state when there are no environments', () => {
    const collection: OpenCollection = { info: { name: 'Empty API', version: '1.0.0' } };
    const root = useRenderToDom(<Environments collection={collection} />);
    expect(root.querySelector('.empty-state-heading')?.text.trim()).toBe('No environments configured');
    expect(root.querySelector('[role="tablist"]')).toBeNull();
  });
});
