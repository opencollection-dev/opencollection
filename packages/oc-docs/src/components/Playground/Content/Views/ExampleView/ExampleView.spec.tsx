import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { ExampleView } from './ExampleView';

const request = { type: 'http', method: 'POST', url: '{{baseUrl}}/api/v1/auth/login' } as any;
const example = {
  name: 'Successful Login',
  description: 'Valid credentials.',
  request: {
    headers: [{ name: 'Content-Type', value: 'application/json' }],
    body: { type: 'json', data: '{ "email": "u@example.com" }' },
  },
  response: {
    status: 200,
    statusText: 'OK',
    body: { type: 'json', data: '{ "token": "abc" }' },
  },
} as any;

describe('ExampleView', () => {
  it('renders name, request and response panes read-only', () => {
    const html = renderToStaticMarkup(<ExampleView request={request} example={example} />);
    expect(html).toContain('Successful Login');
    expect(html).toContain('example-view-request');
    expect(html).toContain('example-view-response');
    expect(html).toContain('200');
    // method/url fall back to the request's flat schema when the example omits them
    expect(html).toContain('{{baseUrl}}/api/v1/auth/login');
    expect(html).toContain('POST');
    // nothing editable: no form controls in the markup
    expect(html).not.toContain('<input');
    expect(html).not.toContain('<textarea');
  });
});
