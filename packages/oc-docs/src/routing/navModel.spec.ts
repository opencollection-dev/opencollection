import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import { buildNavModel, OVERVIEW_SLUG, ENVIRONMENTS_SLUG } from './navModel';

// --- factories (new-schema info-block shape) -------------------------------
const req = (name: string, seq: number, method = 'GET') => ({
  info: { name, type: 'http', seq },
  http: { method, url: `https://x/${name}` },
});

const folder = (name: string, seq: number, items: unknown[] = []) => ({
  info: { name, type: 'folder', seq },
  items,
});

const collection = (items: unknown[], withEnvs = true): OpenCollection =>
  ({
    opencollection: '1.0.0',
    info: { name: 'Hotel API', version: '1.0.0' },
    ...(withEnvs
      ? { config: { environments: [{ name: 'Dev', variables: [] }] } }
      : {}),
    items,
  }) as unknown as OpenCollection;

const sample = () =>
  collection([
    folder('Authentication', 1, [req('Login', 1, 'GET'), req('Register', 2, 'POST')]),
    folder('Hotels', 2, [folder('Browse & Search', 1)]),
    req('Ping', 3, 'GET'),
  ]);

const slugs = (c: OpenCollection) => buildNavModel(c).ordered.map((e) => e.slug);

describe('buildNavModel — ordered sequence', () => {
  it('puts overview then environments at the front, then DFS of items', () => {
    expect(slugs(sample())).toEqual([
      OVERVIEW_SLUG,
      ENVIRONMENTS_SLUG,
      'authentication',
      'authentication/login',
      'authentication/register',
      'hotels',
      'hotels/browse-search',
      'ping',
    ]);
  });

  it('omits the environments entry when the collection has none', () => {
    const c = collection([req('Ping', 1)], false);
    expect(slugs(c)).toEqual([OVERVIEW_SLUG, 'ping']);
  });

  it('orders siblings by seq then name (honours reordering)', () => {
    const c = collection([req('Zebra', 1), req('Apple', 2)]);
    // seq wins over alphabetical
    expect(slugs(c)).toEqual([OVERVIEW_SLUG, ENVIRONMENTS_SLUG, 'zebra', 'apple']);
  });
});

describe('buildNavModel — slugs & metadata', () => {
  it('builds full path-based slugs from the folder hierarchy', () => {
    const model = buildNavModel(sample());
    expect(model.bySlug.has('authentication/login')).toBe(true);
    expect(model.bySlug.has('hotels/browse-search')).toBe(true);
  });

  it('exposes ancestors (folder chain above the node)', () => {
    const model = buildNavModel(sample());
    expect(model.bySlug.get('authentication/login')!.ancestors).toEqual([
      { name: 'Authentication', slug: 'authentication' },
    ]);
    expect(model.bySlug.get('authentication')!.ancestors).toEqual([]);
  });

  it('tags entry type and http method', () => {
    const model = buildNavModel(sample());
    expect(model.bySlug.get('authentication')!.type).toBe('folder');
    const login = model.bySlug.get('authentication/login')!;
    expect(login.type).toBe('request');
    expect(login.method).toBe('GET');
  });

  it('dedupes colliding sibling slugs deterministically', () => {
    const c = collection([folder('Auth', 1), folder('Auth', 2)]);
    expect(slugs(c)).toEqual([OVERVIEW_SLUG, ENVIRONMENTS_SLUG, 'auth', 'auth-2']);
  });
});
