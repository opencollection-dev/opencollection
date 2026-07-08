import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { CodeSnippetTabs } from './CodeSnippetTabs';

describe('CodeSnippetTabs', () => {
  it('renders language tabs and the default cURL snippet, with variables as hover tokens', () => {
    const html = renderToStaticMarkup(
      <CodeSnippetTabs
        method="post"
        url="{{baseUrl}}/api/v1/auth/login"
        headers={[{ name: 'Content-Type', value: 'application/json' }]}
        body={{ type: 'json', data: '{"email":"a@b.com"}' }}
      />
    );
    expect(html).toContain('cURL');
    expect(html).toContain('Javascript');
    expect(html).toContain('Python');
    expect(html).toContain('curl');
    expect(html).toContain('data-var-name="baseUrl"');
    expect(html).toContain('{{baseUrl}}');
  });
});
