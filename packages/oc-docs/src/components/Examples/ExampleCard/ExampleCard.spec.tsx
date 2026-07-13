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
    expect(html).toContain('B');
  });

  it('falls back to a default name and omits Try without a handler', () => {
    const html = renderToStaticMarkup(<ExampleCard example={{ response: { status: 500 } }} method="get" url="/x" />);
    expect(html).toContain('Example');
    expect(html).toContain('--oc-status-danger-text');
    expect(html).not.toContain('>Try<');
  });

  it('colours the status badge by tone: danger for 4xx/5xx, info for 3xx redirects', () => {
    const clientError = renderToStaticMarkup(<ExampleCard example={{ name: 'Bad', response: { status: 404 } }} method="get" url="/x" />);
    expect(clientError).toContain('--oc-status-danger-text');
    const redirect = renderToStaticMarkup(<ExampleCard example={{ name: 'Moved', response: { status: 301 } }} method="get" url="/x" />);
    expect(redirect).toContain('--oc-status-info-text');
  });

  it('shows only the status code in the badge, no reason phrase', () => {
    const collapsed = renderToStaticMarkup(
      <ExampleCard example={{ name: 'Created', response: { status: 201, statusText: 'All Good' } }} method="get" url="/x" />
    );
    expect(collapsed).toContain('201');
    expect(collapsed).not.toContain('All Good');
  });

  it('keeps the reason phrase in the expanded response meta: stored statusText wins, else derived from the code', () => {
    const stored = renderToStaticMarkup(
      <ExampleCard example={{ name: 'Created', response: { status: 201, statusText: 'All Good' } }} method="get" url="/x" defaultExpanded />
    );
    expect(stored).toContain('201 All Good');
    const derived = renderToStaticMarkup(
      <ExampleCard example={{ name: 'Missing', response: { status: 404 } }} method="get" url="/x" defaultExpanded />
    );
    expect(derived).toContain('404 Not Found');
  });

  it('hides the status pill entirely when there is no status', () => {
    const html = renderToStaticMarkup(<ExampleCard example={{ name: 'No status', response: {} }} method="get" url="/x" />);
    expect(html).not.toContain('data-testid="example-status"');
  });

  it('does not render a bare table for an empty request body (reuses getBodyView -> none)', () => {
    const html = renderToStaticMarkup(
      <ExampleCard
        example={{ name: 'Empty form', request: { body: { type: 'form-urlencoded', data: [] } }, response: { status: 200 } }}
        method="post"
        url="/x"
        defaultExpanded
      />
    );
    // Body is empty -> the whole request pane degrades to its empty state, no populated Body tab.
    expect(html).toContain('No request data.');
  });

  it('reuses the shared RequestBody so example bodies inherit multipart file tags', () => {
    const html = renderToStaticMarkup(
      <ExampleCard
        example={{
          name: 'Upload',
          request: { body: { type: 'multipart-form', data: [{ name: 'avatar', type: 'file', value: '/tmp/a.png' }] } },
          response: { status: 200 }
        }}
        method="post"
        url="/x"
        defaultExpanded
      />
    );
    expect(html).toContain('request-body-file-tag');
    expect(html).toContain('/tmp/a.png');
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

  it('shows only Params, Body and Headers tabs for an example never an Auth tab, consistent with Bruno and the OpenCollection schema', () => {
    const html = renderToStaticMarkup(
      <ExampleCard
        example={{
          name: 'Authed',
          request: { auth: { type: 'bearer', token: 'super-secret-token' } } as any,
          response: { status: 200, body: { type: 'json', data: '{}' } }
        }}
        method="post"
        url="/x"
        defaultExpanded
      />
    );
    // The example request pane exposes only Params / Body / Headers — never Auth.
    expect(html).not.toContain('>Auth<');
    expect(html).not.toContain('super-secret-token');
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
    expect(html).toContain('class="example-toggle"');
    expect(html).toContain('class="example-try"');
    expect(html).toContain('aria-expanded="true"');
    // WAI-ARIA tabs.
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('role="tabpanel"');
  });

  it("uses the example's own method (and url) in the header, not the parent request's", () => {
    const html = renderToStaticMarkup(
      <ExampleCard
        example={{
          name: 'Patch user',
          request: { method: 'patch', url: '{{host}}/users/1', body: { type: 'json', data: '{}' } },
          response: { status: 200 }
        }}
        method="get"
        url="{{host}}/parent"
        defaultExpanded
      />
    );
    expect(html).toContain('>PATCH<');
    expect(html).toContain('data-var-name="host"');
    expect(html).toContain('/users/1');
    expect(html).not.toContain('/parent');
  });

  it("falls back to the parent method when the example request omits one", () => {
    const html = renderToStaticMarkup(
      <ExampleCard
        example={{ name: 'No method', request: { url: '{{host}}/x' }, response: { status: 200 } }}
        method="delete"
        url="{{host}}/parent"
        defaultExpanded
      />
    );
    expect(html).toContain('>DELETE<');
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
