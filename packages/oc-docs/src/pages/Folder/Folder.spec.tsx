import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import { Folder } from './Folder';

const collection = {
  info: { name: 'Hotel Booking API' },
  request: { auth: { type: 'bearer', token: 't' } }
} as unknown as OpenCollection;

describe('Folder', () => {
  it('renders the folder name, request count and its configuration', () => {
    const folder: any = {
      info: { name: 'Authentication' },
      request: { auth: 'inherit', scripts: [{ type: 'before-request', code: 'pre()' }] },
      items: [{ info: { type: 'http' } }, { info: { type: 'http' } }, { info: { type: 'http' } }]
    };

    const html = renderToStaticMarkup(<Folder item={folder} collection={collection} />);

    expect(html).toContain('Authentication');
    expect(html).toContain('3 requests');
    expect(html).toContain('Folder Configuration');
    expect(html).toContain('folder-config-auth');
    expect(html).toContain('Inherited from collection');
    expect(html).toContain('folder-config-script');
    expect(html).not.toContain('folder-config-empty');
  });

  it('renders the documentation markdown in its own section', () => {
    const folder: any = {
      info: { name: 'Authentication' },
      docs: { content: '# Auth docs\n\nDetailed **markdown** documentation.', type: 'text/markdown' },
      items: []
    };

    const html = renderToStaticMarkup(<Folder item={folder} collection={collection} />);

    expect(html).toContain('Documentation');
    expect(html).toContain('folder-docs');
    expect(html).toContain('Auth docs');
    expect(html).toContain('<strong>markdown</strong>');
  });

  it('omits the documentation section when the folder has no docs', () => {
    const folder: any = { info: { name: 'Auth' }, items: [] };

    const html = renderToStaticMarkup(<Folder item={folder} collection={collection} />);

    expect(html).not.toContain('folder-docs');
    expect(html).not.toContain('Documentation');
  });

  it('renders the empty state when the folder has no configuration', () => {
    const folder: any = { info: { name: 'Realtime' }, items: [{ info: { type: 'websocket' } }] };

    const html = renderToStaticMarkup(<Folder item={folder} collection={collection} />);

    expect(html).toContain('Realtime');
    expect(html).toContain('1 request');
    expect(html).toContain('folder-config-empty');
    expect(html).toContain('No folder configuration');
    expect(html).not.toContain('folder-config-headers');
  });
});
