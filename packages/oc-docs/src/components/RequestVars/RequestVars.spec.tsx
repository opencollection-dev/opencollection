import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { RequestVars } from './RequestVars';

describe('RequestVars', () => {
  it('renders pre-request and post-response groups', () => {
    const html = renderToStaticMarkup(
      <RequestVars
        preRequest={[{ name: 'content-Type', value: '{{$randomUUID}}' }]}
        postResponse={[{ name: 'authToken', expression: 'res.body.token' }]}
      />
    );
    expect(html).toContain('Pre-Request');
    expect(html).toContain('content-Type');
    expect(html).toContain('Post-Response');
    expect(html).toContain('authToken');
    expect(html).toContain('res.body.token');
  });

  it('renders nothing when there are no vars', () => {
    expect(renderToStaticMarkup(<RequestVars />)).toBe('');
  });
});
