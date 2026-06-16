import { describe, it, expect } from 'vitest';
import type { OpenCollection } from '@opencollection/types';
import { buildNavModel, OVERVIEW_SLUG, ENVIRONMENTS_SLUG } from './navModel';
import { normalizeSlug, resolveSlug } from './resolve';

const req = (name: string, seq: number, method = 'GET') => ({
  info: { name, type: 'http', seq },
  http: { method, url: `https://x/${name}` },
});
const folder = (name: string, seq: number, items: unknown[] = []) => ({
  info: { name, type: 'folder', seq },
  items,
});
const model = () =>
  buildNavModel({
    opencollection: '1.0.0',
    info: { name: 'Hotel API' },
    config: { environments: [{ name: 'Dev', variables: [] }] },
    items: [folder('Authentication', 1, [req('Login', 1, 'POST'), req('Register', 2)])],
  } as unknown as OpenCollection);

describe('normalizeSlug', () => {
  it('strips leading and trailing slashes', () => {
    expect(normalizeSlug('/authentication/login/')).toBe('authentication/login');
  });
  it('maps the bare root to the overview slug', () => {
    expect(normalizeSlug('/')).toBe(OVERVIEW_SLUG);
    expect(normalizeSlug('')).toBe(OVERVIEW_SLUG);
  });
});

describe('resolveSlug', () => {
  it('resolves overview with no prev and environments as next', () => {
    const r = resolveSlug(model(), '')!;
    expect(r.entry.type).toBe('overview');
    expect(r.prev).toBeUndefined();
    expect(r.next).toMatchObject({ slug: ENVIRONMENTS_SLUG, type: 'environments' });
  });

  it('resolves a slug with a leading slash and gives folder/request neighbours', () => {
    const r = resolveSlug(model(), '/authentication')!;
    expect(r.entry.type).toBe('folder');
    expect(r.prev).toMatchObject({ slug: ENVIRONMENTS_SLUG });
    expect(r.next).toMatchObject({ slug: 'authentication/login', method: 'POST' });
  });

  it('gives no next for the last entry in the sequence', () => {
    const r = resolveSlug(model(), 'authentication/register')!;
    expect(r.next).toBeUndefined();
    expect(r.prev).toMatchObject({ slug: 'authentication/login' });
  });

  it('returns null for an unknown slug', () => {
    expect(resolveSlug(model(), 'does/not/exist')).toBeNull();
  });
});
