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

  it('renders nothing for an empty/none body', () => {
    expect(renderToStaticMarkup(<RequestBody body={undefined} />)).toBe('');
  });
});
