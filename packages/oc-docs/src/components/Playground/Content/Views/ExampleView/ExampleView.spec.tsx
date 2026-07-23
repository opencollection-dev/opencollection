import React from 'react';
import { describe, it, expect } from 'vitest';
import { ExampleView } from './ExampleView';
import { useRenderToDom } from '../../../../../hooks/useRenderToDom';
import { query } from '../../../../../test-utils/dom';

const request = { type: 'http', method: 'POST', url: '{{baseUrl}}/api/v1/auth/login' } as any;
const example = {
  name: 'Successful Login',
  description: 'Valid credentials.',
  request: {
    headers: [{ name: 'Content-Type', value: 'application/json' }],
    body: { type: 'json', data: '{ "email": "u@example.com" }' }
  },
  response: {
    status: 200,
    statusText: 'OK',
    body: { type: 'json', data: '{ "token": "abc" }' }
  }
} as any;

describe('ExampleView', () => {
  it('renders name, request and response panes read-only', () => {
    const root = useRenderToDom(<ExampleView request={request} example={example} />);
    expect(query(root, '.example-view-name').text).toContain('Successful Login');
    expect(root.querySelector('[data-testid="example-view-request"]')).not.toBeNull();
    expect(root.querySelector('[data-testid="example-view-response"]')).not.toBeNull();
    expect(root.text).toContain('200');
    // method/url fall back to the request's flat schema when the example omits them
    expect(query(root, '.example-view-url').text).toContain('{{baseUrl}}/api/v1/auth/login');
    expect(root.text).toContain('POST');
    // nothing editable: no form controls
    expect(root.querySelector('input')).toBeNull();
    expect(root.querySelector('textarea')).toBeNull();
  });

  it('renders the example-name suffix after a named example', () => {
    const root = useRenderToDom(<ExampleView request={request} example={example} />);
    expect(query(root, '.example-view-name-suffix').text).toContain('/ Example');
  });

  it('shows an empty message when the request has no params, headers or body', () => {
    const root = useRenderToDom(<ExampleView request={request} example={{ ...example, request: {} }} />);
    const empty = root.querySelector('[data-testid="example-view-request-empty"]');
    expect(empty).not.toBeNull();
    expect(empty!.textContent).toContain('No params, headers, or body configured for this request.');
  });
});
