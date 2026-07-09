import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import { buildNavModel, OVERVIEW_SLUG, ENVIRONMENTS_SLUG } from './navModel';

// --- factories (new-schema info-block shape) -------------------------------
const req = (name: string, seq?: number, method = 'GET') => ({
  info: { name, type: 'http', seq },
  http: { method, url: `https://x/${name}` },
});

const folder = (name: string, seq?: number, items: unknown[] = []) => ({
  info: { name, type: 'folder', seq },
  items,
});

const script = (name: string, seq: number) => ({
  info: { name, type: 'script', seq },
  script: '// noop',
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
      'hotels/browse-%26-search',
      'ping',
    ]);
  });

  it('omits the environments entry when the collection has none', () => {
    const c = collection([req('Ping', 1)], false);
    expect(slugs(c)).toEqual([OVERVIEW_SLUG, 'ping']);
  });

  it('sorts requests by seq (mirrors the Bruno app)', () => {
    const c = collection([req('Zebra', 2), req('Apple', 1)]);
    expect(slugs(c)).toEqual([OVERVIEW_SLUG, ENVIRONMENTS_SLUG, 'apple', 'zebra']);
  });

  it('groups folders before requests regardless of seq', () => {
    // Request seq (1) is lower than the folder seq (2), but folders still come
    // first — matching the app grouping [folders, requests, files].
    const c = collection([req('Ping', 1), folder('Tools', 2, [req('Run', 1)])]);
    expect(slugs(c)).toEqual([OVERVIEW_SLUG, ENVIRONMENTS_SLUG, 'tools', 'tools/run', 'ping']);
  });

  it('orders folders without a valid seq alphabetically', () => {
    const c = collection([folder('Zoo', 0, []), folder('Ant', 0, [])]);
    expect(slugs(c)).toEqual([OVERVIEW_SLUG, ENVIRONMENTS_SLUG, 'ant', 'zoo']);
  });

  it('splices a seq folder into the alphabetical base at position seq-1 (Bruno app parity)', () => {
    // Alphabetical base = [Apple, Mango]; Zed has seq 1 so it lands at index 0.
    const c = collection([folder('Zed', 1, []), folder('Apple'), folder('Mango')]);
    expect(slugs(c)).toEqual([OVERVIEW_SLUG, ENVIRONMENTS_SLUG, 'zed', 'apple', 'mango']);
  });

  it('orders requests by seq and keeps a request without a seq', () => {
    const c = collection([req('Zed', 2), req('Yak', 1), req('Loner')]);
    const s = slugs(c);
    expect(s).toContain('loner');
    expect(s.indexOf('yak')).toBeLessThan(s.indexOf('zed'));
  });
});

describe('buildNavModel — slugs & metadata', () => {
  it('builds full path-based slugs from the folder hierarchy', () => {
    const model = buildNavModel(sample());
    expect(model.bySlug.has('authentication/login')).toBe(true);
    expect(model.bySlug.has('hotels/browse-%26-search')).toBe(true);
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

  it('tags a script item as its own page type (not request)', () => {
    const c = collection([script('Setup', 1)]);
    const model = buildNavModel(c);
    expect(model.bySlug.get('setup')!.type).toBe('script');
  });

  it('dedupes colliding sibling slugs deterministically', () => {
    const c = collection([folder('Auth', 1), folder('Auth', 2)]);
    expect(slugs(c)).toEqual([OVERVIEW_SLUG, ENVIRONMENTS_SLUG, 'auth', 'auth-2']);
  });
});
