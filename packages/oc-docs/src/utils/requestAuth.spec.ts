import { describe, it, expect } from 'vitest';
import { humanizeAuthMode, resolveInheritedAuth } from './requestAuth';
import { AUTH_MODE_LABELS } from '../constants';

describe('requestAuth', () => {
  it('humanizes auth modes with fallbacks', () => {
    expect(humanizeAuthMode(undefined, AUTH_MODE_LABELS)).toBe('No Auth');
    expect(humanizeAuthMode('inherit', AUTH_MODE_LABELS)).toBe('Inherit');
    expect(humanizeAuthMode({ type: 'basic' } as any, AUTH_MODE_LABELS)).toBe('Basic Auth');
  });

  it('returns own auth when it is not inherit', () => {
    const item: any = { runtime: { auth: { type: 'bearer', token: 't' } } };
    expect(resolveInheritedAuth(null, [], item).auth).toMatchObject({ type: 'bearer' });
  });

  it('resolves inherited auth from the nearest concrete ancestor, else collection', () => {
    const item: any = { runtime: { auth: 'inherit' } };
    const folder: any = { info: { type: 'folder', name: 'F' }, request: { auth: { type: 'apikey', key: 'k' } } };
    const resolved = resolveInheritedAuth({ info: { name: 'C' } } as any, [folder], item);
    expect(resolved.auth).toMatchObject({ type: 'apikey' });
    expect(resolved.source).toEqual({ level: 'folder', name: 'F' });
  });

  it('falls back to collection auth when no ancestor defines one', () => {
    const item: any = { runtime: { auth: 'inherit' } };
    const collection: any = { info: { name: 'C' }, request: { auth: { type: 'bearer', token: 't' } } };
    const resolved = resolveInheritedAuth(collection, [], item);
    expect(resolved.auth).toMatchObject({ type: 'bearer' });
    expect(resolved.source).toEqual({ level: 'collection', name: 'C' });
  });
});
