import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Item } from '@opencollection/types/collection/item';
import { Request } from './Request';
import { useRenderToDom } from '../../hooks/useRenderToDom';

const collection: OpenCollection = {
  info: { name: 'Auth API', version: '1.0.0' },
  request: {
    scripts: [{ type: 'tests', code: 'test("collection-level check", () => {})' }]
  }
};

const ancestry: Item[] = [
  { uuid: 'folder-1', info: { name: 'Authentication', type: 'folder' } } as unknown as Item
];

const item: HttpRequest = {
  info: { name: 'Login', type: 'http', description: 'Authenticate a user and return a token.' },
  http: {
    method: 'post',
    url: '{{baseUrl}}/auth/login',
    headers: [{ name: 'Content-Type', value: 'application/json' }],
    params: [
      { name: 'tenant', value: 'acme', type: 'path' },
      { name: 'verbose', value: 'true', type: 'query' }
    ],
    body: { type: 'json', data: '{"email":"a@b.com"}' }
  },
  runtime: {
    auth: { type: 'bearer', token: '{{token}}' },
    variables: [{ name: 'attempt', value: '1' }],
    assertions: [{ expression: 'res.status', operator: 'eq', value: '200' }],
    scripts: [
      { type: 'before-request', code: 'console.log("pre")' },
      { type: 'tests', code: 'test("returns a token", () => {})' }
    ],
    actions: [
      {
        type: 'set-variable',
        selector: { expression: 'res.body.token', method: 'jsonq' },
        variable: { name: 'authToken', scope: 'runtime' }
      }
    ]
  } as HttpRequest['runtime'],
  examples: [{ name: 'Success', response: { status: 200, body: { type: 'json', data: '{"token":"x"}' } } }]
};

describe('Request page', () => {
  it('renders the breadcrumb, heading, url bar, description and all populated sections', () => {
    const root = useRenderToDom(<Request item={item} ancestry={ancestry} collection={collection} onTryClick={() => {}} />);

    expect(root.querySelector('[data-testid="request-breadcrumb"]')?.text).toContain('Authentication');
    expect(root.querySelector('[data-testid="request-title"]')?.text).toContain('Login');
    expect(root.querySelector('[data-testid="request-url"]')?.text).toContain('auth/login');
    expect(root.querySelectorAll('button').some((b) => b.text.trim() === 'Try')).toBe(true);
    expect(root.querySelector('[data-testid="request-description"]')?.text).toContain('Authenticate a user');

    for (const slug of ['params', 'body', 'headers', 'auth', 'code-snippet', 'examples', 'execution-context']) {
      expect(root.querySelector(`[data-testid="request-section-${slug}"]`)).not.toBeNull();
    }

    const params = root.querySelector('[data-testid="request-section-params"]');
    expect(params?.text).toContain('tenant');
    expect(params?.text).toContain('verbose');
    expect(root.querySelector('[data-testid="request-section-code-snippet"]')?.text).toContain('curl --request POST');

    const exec = root.querySelector('[data-testid="execution-context"]');
    expect(exec?.text).toContain('attempt');
    expect(exec?.text).toContain('authToken');
    expect(root.querySelector('[data-testid="execution-context-tabs-tab-scripts"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="execution-context-tabs-tab-asserts"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="execution-context-tabs-tab-tests"]')).not.toBeNull();
  });

  it('shows empty states (not bare sections) when nothing is configured, and always shows the code snippet', () => {
    const bare: HttpRequest = {
      info: { name: 'Ping', type: 'http' },
      http: { method: 'get', url: '/ping' }
    };
    const html = renderToStaticMarkup(<Request item={bare} />);
    expect(html).toContain('Ping');
    expect(html).toContain('/ping');
    // No params/body/headers/auth -> a single "No request configuration" empty state, not the individual sections.
    expect(html).toContain('No request configuration');
    expect(html).not.toContain('Params');
    // The code snippet is always shown (on the right).
    expect(html).toContain('Code Snippet');
    // No examples authored -> the Examples section is hidden entirely (no empty state).
    expect(html).not.toContain('Examples');
    // No scripts/vars/asserts/tests -> the Execution Context section shows its own empty state.
    expect(html).toContain('Execution Context');
    expect(html).toContain('No execution context');
  });

  it('renders the Auth section for auth declared in the http block (http.auth: inherit)', () => {
    // Real collections (e.g. bruno-genui-collection) put auth at http.auth, not runtime.auth.
    const inheritItem: HttpRequest = {
      info: { name: 'Get All Customers', type: 'http' },
      http: { method: 'GET', url: '{{baseUrl}}/billing/customers', auth: 'inherit' }
    };
    const html = renderToStaticMarkup(<Request item={inheritItem} collection={collection} ancestry={ancestry} />);
    expect(html).toContain('Auth');
    expect(html).toContain('Inherit');
    expect(html).toContain('Code Snippet');
  });

  it('does not apply smart typography to docs prose', () => {
    const docsItem: HttpRequest = {
      info: { name: 'Doc test', type: 'http' },
      http: { method: 'GET', url: '/x' },
      docs: 'Use -- dashes and (c) marks literally.'
    };
    const html = renderToStaticMarkup(<Request item={docsItem} />);
    expect(html).toContain('Use -- dashes');
    expect(html).toContain('(c)');
    expect(html).not.toContain('–'); // en-dash
    expect(html).not.toContain('©'); // ©
  });
});
