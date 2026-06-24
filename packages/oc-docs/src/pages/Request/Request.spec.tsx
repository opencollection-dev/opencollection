import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import type { HttpRequest } from '@opencollection/types/requests/http';
import type { Item } from '@opencollection/types/collection/item';
import { Request } from './Request';

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
    const html = renderToStaticMarkup(<Request item={item} ancestry={ancestry} collection={collection} onTryClick={() => {}} />);

    // breadcrumb + heading
    expect(html).toContain('Authentication');
    expect(html).toContain('Login');
    expect(html).toContain('Breadcrumb');
    // url bar
    expect(html).toContain('auth/login');
    expect(html).toContain('Try</button>');
    // description
    expect(html).toContain('Authenticate a user');
    // section labels
    expect(html).toContain('Auth');
    expect(html).toContain('Params');
    expect(html).toContain('Body');
    expect(html).toContain('Headers');
    // Variables now live in the Execution-context "Variables" card (not a left-column section).
    expect(html).toContain('Variables');
    expect(html).toContain('Code Snippet');
    expect(html).toContain('Examples');
    expect(html).toContain('Execution Context');
    // params split
    expect(html).toContain('tenant');
    expect(html).toContain('verbose');
    // code snippet
    expect(html).toContain('curl -X POST');
    // execution context: collection-level + request-level tests inherit; asserts render
    // and the Tests card offers a "View complete code" link (counts were removed).
    expect(html).toContain('returns a token');
    expect(html).toContain('collection-level check');
    expect(html).toContain('res.status');
    expect(html).toContain('View complete code');
  });

  it('omits sections that have no content', () => {
    const bare: HttpRequest = {
      info: { name: 'Ping', type: 'http' },
      http: { method: 'get', url: '/ping' }
    };
    const html = renderToStaticMarkup(<Request item={bare} />);
    expect(html).toContain('Ping');
    expect(html).toContain('/ping');
    expect(html).not.toContain('Examples');
    expect(html).not.toContain('Execution Context');
    expect(html).not.toContain('Params');
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
