import { describe, it, expect } from 'vitest';
import { mergeAuth } from './request-merger';
import { getRequestAuth } from '../../utils/schemaHelpers';

// A playground request keeps its auth on the http protocol block; folders/collection nest
// it under `request.auth`. Auth is either a concrete object, the string 'inherit', or
// undefined (= No Auth).
const httpRequest = (auth: unknown): any => ({ http: { method: 'GET', url: 'https://x', auth } });
const folder = (name: string, auth: unknown): any => ({ info: { type: 'folder', name }, request: { auth } });
const collection = (auth: unknown): any => ({ info: { name: 'C' }, request: { auth } });

const BASIC = { type: 'basic', username: 'u', password: 'p' };
const BEARER = { type: 'bearer', token: 't' };
const APIKEY = { type: 'apikey', key: 'k', value: 'v', placement: 'header' };

// mergeAuth mutates the request; read back the effective auth the executor will use.
const resolve = (request: any, coll: any, path: any[] = []): unknown => {
  mergeAuth(coll, request, path);
  return getRequestAuth(request);
};

describe('mergeAuth (inherited-auth resolution for the playground send path)', () => {
  describe('acceptance #1 — a request set to inherit uses its nearest parent', () => {
    it('resolves from the collection when no folder configures auth', () => {
      expect(resolve(httpRequest('inherit'), collection(BEARER))).toMatchObject(BEARER);
    });

    it('prefers the closest folder over the collection', () => {
      const path = [folder('shallow', BASIC), folder('deep', APIKEY)]; // root -> leaf
      expect(resolve(httpRequest('inherit'), collection(BEARER), path)).toMatchObject(APIKEY);
    });
  });

  describe('acceptance #2 — a folder set to inherit resolves from its own parent chain', () => {
    it('is transparent and falls through to the collection', () => {
      expect(resolve(httpRequest('inherit'), collection(BASIC), [folder('F', 'inherit')])).toMatchObject(BASIC);
    });

    it('is transparent and falls through to a shallower concrete folder (not skipping past it to the collection)', () => {
      const path = [folder('outer', BEARER), folder('inner', 'inherit')];
      expect(resolve(httpRequest('inherit'), collection(BASIC), path)).toMatchObject(BEARER);
    });
  });

  describe('acceptance #3 — the resolved auth is applied for every supported mode', () => {
    for (const mode of [BASIC, BEARER, { type: 'apikey', key: 'k', value: 'v', placement: 'query' }]) {
      it(`applies inherited ${mode.type}`, () => {
        expect(resolve(httpRequest('inherit'), collection(mode))).toMatchObject(mode);
      });
    }
  });

  describe('acceptance #4 — an explicit No Auth is respected and never overridden by a parent', () => {
    it('leaves a request with its own concrete auth untouched, ignoring the parent', () => {
      const own = { type: 'bearer', token: 'own' };
      expect(resolve(httpRequest(own), collection(BASIC))).toMatchObject(own);
    });

    it('respects No Auth on the request itself against an authed collection', () => {
      expect(resolve(httpRequest(undefined), collection(BEARER), [folder('F', BASIC)])).toBeUndefined();
    });

    it('a folder set to No Auth blocks the collection auth for an inheriting request', () => {
      expect(resolve(httpRequest('inherit'), collection(BEARER), [folder('F', undefined)])).toBeUndefined();
    });

    it('the closest No-Auth level wins over a shallower concrete folder', () => {
      const path = [folder('outer', BEARER), folder('inner', undefined)]; // inner = No Auth, blocks
      expect(resolve(httpRequest('inherit'), collection(BASIC), path)).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('falls back to No Auth when an inherit chain configures nothing concrete', () => {
      expect(resolve(httpRequest('inherit'), collection(undefined), [folder('F', 'inherit')])).toBeUndefined();
    });

    it('does not alias the shared collection/folder auth object into the per-run request', () => {
      const coll = collection(BEARER);
      const request = httpRequest('inherit');
      mergeAuth(coll, request, []);
      const applied = getRequestAuth(request) as any;
      expect(applied).toMatchObject(BEARER);
      expect(applied).not.toBe(coll.request.auth); // cloned, not the same reference
      applied.token = 'mutated';
      expect(coll.request.auth.token).toBe('t'); // mutation does not leak back to the collection
    });
  });
});
