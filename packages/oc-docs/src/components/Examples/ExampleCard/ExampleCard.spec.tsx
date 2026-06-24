import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ExampleCard } from './ExampleCard';
import type { HttpRequestExample } from '@opencollection/types/requests/http';

const example: HttpRequestExample = {
  name: 'Successful login',
  description: 'Returns an auth token',
  request: {
    url: '{{baseUrl}}/auth/login',
    headers: [{ name: 'Content-Type', value: 'application/json' }],
    params: [{ name: 'verbose', value: 'true', type: 'query' }],
    body: { type: 'json', data: '{"email":"a@b.com"}' }
  },
  response: {
    status: 200,
    statusText: 'OK',
    headers: [{ name: 'Content-Type', value: 'application/json' }],
    body: { type: 'json', data: '{"token":"abc"}' }
  }
};

describe('ExampleCard', () => {
  it('shows the name, status and a Try button when collapsed', () => {
    const html = renderToStaticMarkup(<ExampleCard example={example} method="post" url="{{baseUrl}}/auth/login" onTry={() => {}} />);
    expect(html).toContain('Successful login');
    expect(html).toContain('200');
    expect(html).toContain('>Try<');
    expect(html).toContain('--oc-status-success-text');
    // collapsed: detail panes are not rendered
    expect(html).not.toContain('REQUEST');
  });

  it('renders request and response panes when expanded', () => {
    const html = renderToStaticMarkup(
      <ExampleCard example={example} method="post" url="{{baseUrl}}/auth/login" defaultExpanded />
    );
    expect(html).toContain('REQUEST');
    expect(html).toContain('RESPONSE');
    expect(html).toContain('Params');
    expect(html).toContain('Body');
    expect(html).toContain('Headers');
    // computed response size is shown
    expect(html).toContain('B');
  });

  it('falls back to a default name and omits Try without a handler', () => {
    const html = renderToStaticMarkup(<ExampleCard example={{ response: { status: 500 } }} method="get" url="/x" />);
    expect(html).toContain('Example');
    expect(html).toContain('--oc-status-danger-text');
    // the Try control is not rendered without a handler
    expect(html).not.toContain('>Try<');
  });

  it('colours the status badge by class: 4xx error (red), 3xx info (blue)', () => {
    const clientError = renderToStaticMarkup(<ExampleCard example={{ name: 'Bad', response: { status: 404 } }} method="get" url="/x" />);
    expect(clientError).toContain('--oc-status-danger-text');
    const redirect = renderToStaticMarkup(<ExampleCard example={{ name: 'Moved', response: { status: 301 } }} method="get" url="/x" />);
    expect(redirect).toContain('--oc-status-info-text');
  });

  it('shows a single empty state for a side with no data', () => {
    const html = renderToStaticMarkup(
      <ExampleCard
        example={{ name: 'No request', response: { status: 200, body: { type: 'json', data: '{}' } } }}
        method="get"
        url="/x"
        defaultExpanded
      />
    );
    expect(html).toContain('No request data.');
    expect(html).toContain('RESPONSE');
  });

  it('renders Params/Body/Headers tabs and omits Auth when the request has no auth', () => {
    const html = renderToStaticMarkup(
      <ExampleCard
        example={{ name: 'Body only', request: { body: { type: 'json', data: '{"a":1}' } }, response: { status: 200 } }}
        method="post"
        url="/x"
        defaultExpanded
      />
    );
    expect(html).toContain('Params');
    expect(html).toContain('Body');
    expect(html).toContain('Headers');
    // No auth on the request → the Auth tab is not rendered at all.
    expect(html).not.toContain('Auth');
    // the response has neither body nor headers → its empty state shows
    expect(html).toContain('No response data.');
  });

  it('renders the request auth in the Auth tab (mode label + masked secret)', () => {
    const html = renderToStaticMarkup(
      <ExampleCard
        example={{
          name: 'Authed',
          request: { auth: { type: 'bearer', token: 'super-secret-token' } },
          response: { status: 200, body: { type: 'json', data: '{}' } }
        }}
        method="post"
        url="/x"
        defaultExpanded
      />
    );
    // Auth tab is the default-selected pane (it is the only request tab with data).
    expect(html).toContain('Auth');
    expect(html).toContain('Bearer Token'); // AUTH_MODE_LABELS[bearer]
    expect(html).toContain('Token'); // field label
    expect(html).not.toContain('super-secret-token'); // token is masked
  });

  it('renders a description object and accessible tab semantics', () => {
    const html = renderToStaticMarkup(
      <ExampleCard
        example={{
          name: 'X',
          description: { type: 'text/markdown', content: 'A described example' },
          request: { body: { type: 'json', data: '{}' } },
          response: { status: 200, body: { type: 'json', data: '{}' } }
        }}
        method="post"
        url="/x"
        onTry={() => {}}
        defaultExpanded
      />
    );
    expect(html).toContain('A described example');
    // Toggle and Try are separate, sibling buttons (never nested).
    expect(html).toContain('class="oc-example-toggle"');
    expect(html).toContain('class="oc-example-try"');
    expect(html).toContain('aria-expanded="true"');
    // WAI-ARIA tabs.
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('role="tabpanel"');
  });

  it('splits Params into Path and Query and labels the tab "path & query"', () => {
    const html = renderToStaticMarkup(
      <ExampleCard
        example={{
          name: 'Org search',
          request: {
            url: '{{host}}/api/orgs/:orgId/users/search',
            params: [
              { name: 'orgId', value: 'org_42', type: 'path' },
              { name: 'q', value: 'alice', type: 'query' }
            ]
          },
          response: { status: 200 }
        }}
        method="get"
        url="/x"
        defaultExpanded
      />
    );
    expect(html).toContain('path &amp; query'); // tab label (the & is HTML-escaped)
    expect(html).toContain('Path');
    expect(html).toContain('Query');
    expect(html).toContain('orgId');
    expect(html).toContain('alice');
  });
});
