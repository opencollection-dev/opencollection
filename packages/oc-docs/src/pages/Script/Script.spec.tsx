import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { Script } from './Script';
import type { Item, ScriptFile } from '@opencollection/types/collection/item';

const scriptItem = {
  info: { name: 'Script', type: 'script' },
  script: '{\n  "email": "user@example.com",\n  "password": "password123"\n}'
} as unknown as ScriptFile;

const ancestry = [
  { info: { name: 'Authentication', type: 'folder' }, uuid: 'auth-uuid' }
] as unknown as Item[];

describe('Script page', () => {
  it('renders the breadcrumb path, the title and the script source', () => {
    const html = renderToStaticMarkup(<Script item={scriptItem} ancestry={ancestry} />);
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain('Authentication');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('<h1');
    expect(html).toContain('Script');
    expect(html).toContain('user@example.com');
    expect(html).toContain('password123');
  });

  it('falls back to "Script" with no name and tolerates a missing source', () => {
    const html = renderToStaticMarkup(<Script item={{ type: 'script' } as ScriptFile} />);
    expect(html).toContain('Script');
  });
});
