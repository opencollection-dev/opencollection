import React from 'react';
import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import { useRenderToDom } from '../../hooks/useRenderToDom';
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

    const root = useRenderToDom(<Folder item={folder} collection={collection} />);

    expect(root.querySelector('[data-testid="folder-title"]')?.text.trim()).toBe('Authentication');
    expect(root.querySelector('[data-testid="folder-request-count"]')?.text.trim()).toBe('3 requests');
    expect(root.querySelector('[data-testid="folder-section-configuration"] h2')?.text.trim()).toBe('Folder Configuration');

    const authGroup = root.querySelector('[data-testid="folder-config-auth"]');
    expect(authGroup).toBeTruthy();
    expect(authGroup?.text).toContain('Inherited from collection');
    expect(root.querySelector('[data-testid="folder-config-script"]')).toBeTruthy();
    expect(root.querySelector('[data-testid="folder-config-empty"]')).toBeNull();
  });

  it('renders the documentation markdown in its own section', () => {
    const folder: any = {
      info: { name: 'Authentication' },
      docs: { content: '# Auth docs\n\nDetailed **markdown** documentation.', type: 'text/markdown' },
      items: []
    };

    const root = useRenderToDom(<Folder item={folder} collection={collection} />);

    expect(root.querySelector('[data-testid="folder-section-documentation"] h2')?.text.trim()).toBe('Documentation');
    const docs = root.querySelector('[data-testid="folder-docs"]');
    expect(docs).toBeTruthy();
    expect(docs?.querySelector('h1')?.text.trim()).toBe('Auth docs');
    expect(docs?.querySelector('strong')?.text.trim()).toBe('markdown');
  });

  it('omits the documentation section when the folder has no docs', () => {
    const folder: any = { info: { name: 'Auth' }, items: [] };

    const root = useRenderToDom(<Folder item={folder} collection={collection} />);

    expect(root.querySelector('[data-testid="folder-docs"]')).toBeNull();
    expect(root.querySelector('[data-testid="folder-section-documentation"]')).toBeNull();
  });

  it('renders the empty state when the folder has no configuration', () => {
    const folder: any = { info: { name: 'Realtime' }, items: [{ info: { type: 'websocket' } }] };

    const root = useRenderToDom(<Folder item={folder} collection={collection} />);

    expect(root.querySelector('[data-testid="folder-title"]')?.text.trim()).toBe('Realtime');
    expect(root.querySelector('[data-testid="folder-request-count"]')?.text.trim()).toBe('1 request');

    const empty = root.querySelector('[data-testid="folder-config-empty"]');
    expect(empty).toBeTruthy();
    expect(empty?.querySelector('.empty-state-heading')?.text.trim()).toBe('No folder configuration');
    expect(root.querySelector('[data-testid="folder-config-headers"]')).toBeNull();
  });
});
