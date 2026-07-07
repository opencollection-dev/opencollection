import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { RequestBody } from './RequestBody';

describe('RequestBody', () => {
  it('renders a JSON body as a labelled code block', () => {
    const html = renderToStaticMarkup(<RequestBody body={{ type: 'json', data: '{"email":"a@b.com"}' }} />);
    expect(html).toContain('application/json');
    expect(html).toContain('language-json');
    expect(html).toContain('a@b.com');
  });

  it('renders a form-urlencoded body as a table', () => {
    const html = renderToStaticMarkup(
      <RequestBody body={{ type: 'form-urlencoded', data: [{ name: 'name', value: 'Alice' }] }} />
    );
    expect(html).toContain('application/x-www-form-urlencoded');
    expect(html).toContain('name');
    expect(html).toContain('Alice');
  });

  it('tags multipart file parts and surfaces part descriptions', () => {
    const html = renderToStaticMarkup(
      <RequestBody
        body={{
          type: 'multipart-form',
          data: [{ name: 'avatar', type: 'file', value: '/tmp/a.png', description: 'profile picture' }]
        }}
      />
    );
    expect(html).toContain('request-body-file-tag');
    expect(html).toContain('/tmp/a.png');
    expect(html).toContain('profile picture');
  });

  it('surfaces a per-part content type', () => {
    const html = renderToStaticMarkup(
      <RequestBody
        body={{ type: 'multipart-form', data: [{ name: 'meta', type: 'text', value: '{}', contentType: 'application/json' }] }}
      />
    );
    expect(html).toContain('request-body-content-type');
    expect(html).toContain('application/json');
  });

  it('renders every file-body variant with its content type and marks the selected one', () => {
    const html = renderToStaticMarkup(
      <RequestBody
        body={{
          type: 'file',
          data: [
            { filePath: '/a.json', contentType: 'application/json', selected: false },
            { filePath: '/b.xml', contentType: 'application/xml', selected: true }
          ]
        }}
      />
    );
    expect(html).toContain('/a.json');
    expect(html).toContain('application/json');
    expect(html).toContain('/b.xml');
    expect(html).toContain('selected');
  });

  it('surfaces a file-body variant description alongside its content type', () => {
    const html = renderToStaticMarkup(
      <RequestBody
        body={
          {
            type: 'file',
            data: [
              { filePath: '/payload.json', contentType: 'application/json', selected: true, description: 'Primary upload payload' }
            ]
          } as any
        }
      />
    );
    expect(html).toContain('/payload.json');
    expect(html).toContain('application/json');
    expect(html).toContain('Primary upload payload');
    expect(html).toContain('oc-description');
  });

  it('renders nothing for an empty/none body', () => {
    expect(renderToStaticMarkup(<RequestBody body={undefined} />)).toBe('');
    expect(renderToStaticMarkup(<RequestBody body={{ type: 'form-urlencoded', data: [] }} />)).toBe('');
    expect(renderToStaticMarkup(<RequestBody body={{ type: 'file', data: [] }} />)).toBe('');
  });
});
