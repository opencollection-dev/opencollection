import React from 'react';
import { describe, it, expect } from 'vitest';
import { RequestBody } from './RequestBody';
import { useRenderToDom } from '../../../hooks/useRenderToDom';
import { queryByTestId } from '../../../test-utils/dom';

describe('RequestBody', () => {
  it('renders a JSON body as a labelled code block', () => {
    const root = useRenderToDom(<RequestBody body={{ type: 'json', data: '{"email":"a@b.com"}' }} />);
    expect(root.querySelector('.content-type-badge')?.text.trim()).toBe('application/json');
    const code = queryByTestId(root, 'code');
    expect(code).not.toBeNull();
    expect(code?.text).toContain('a@b.com');
  });

  it('wraps variables in a raw body as tokens so they surface the hover card', () => {
    const root = useRenderToDom(<RequestBody body={{ type: 'json', data: '{"endpoint":"{{baseUrl}}/v1"}' }} />);
    expect(root.toString()).toContain('data-testid="variable-token-baseUrl"');
  });

  it('renders a form-urlencoded body as a table', () => {
    const root = useRenderToDom(
      <RequestBody body={{ type: 'form-urlencoded', data: [{ name: 'name', value: 'Alice' }] }} />
    );
    expect(root.querySelector('.content-type-badge')?.text.trim()).toBe('application/x-www-form-urlencoded');
    expect(root.querySelector('.property-key')?.text.trim()).toBe('name');
    expect(root.querySelector('.property-value-cell')?.text.trim()).toBe('Alice');
  });

  it('tags multipart file parts and surfaces part descriptions', () => {
    const root = useRenderToDom(
      <RequestBody
        body={{
          type: 'multipart-form',
          data: [{ name: 'avatar', type: 'file', value: '/tmp/a.png', description: 'profile picture' }]
        }}
      />
    );
    expect(root.querySelector('.request-body-file-tag')?.text.trim()).toBe('File');
    expect(root.querySelector('.request-body-part')?.text).toContain('/tmp/a.png');
    expect(root.querySelector('.description')?.text.trim()).toBe('profile picture');
  });

  it('surfaces a per-part content type', () => {
    const root = useRenderToDom(
      <RequestBody
        body={{ type: 'multipart-form', data: [{ name: 'meta', type: 'text', value: '{}', contentType: 'application/json' }] }}
      />
    );
    expect(root.querySelector('.request-body-content-type')?.text.trim()).toBe('application/json');
  });

  it('renders every file-body variant with its content type and marks the selected one', () => {
    const root = useRenderToDom(
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
    const labels = root.querySelectorAll('.property-key').map((key) => key.text.trim());
    expect(labels).toEqual(['File 1', 'File 2 · selected']);
    const parts = root.querySelectorAll('.request-body-part').map((part) => part.text);
    expect(parts[0]).toContain('/a.json');
    expect(parts[0]).toContain('application/json');
    expect(parts[1]).toContain('/b.xml');
    expect(parts[1]).toContain('application/xml');
  });

  it('surfaces a file-body variant description alongside its content type', () => {
    const root = useRenderToDom(
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
    expect(root.querySelector('.request-body-part')?.text).toContain('/payload.json');
    expect(root.querySelector('.request-body-content-type')?.text.trim()).toBe('application/json');
    expect(root.querySelector('.description')?.text.trim()).toBe('Primary upload payload');
  });

  it('renders nothing for an empty/none body', () => {
    expect(useRenderToDom(<RequestBody body={undefined} />).querySelector('.request-body')).toBeNull();
    expect(useRenderToDom(<RequestBody body={{ type: 'form-urlencoded', data: [] }} />).querySelector('.request-body')).toBeNull();
    expect(useRenderToDom(<RequestBody body={{ type: 'file', data: [] }} />).querySelector('.request-body')).toBeNull();
  });
});
