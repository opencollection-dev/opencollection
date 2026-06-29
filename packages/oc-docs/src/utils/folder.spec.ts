import { describe, it, expect } from 'vitest';
import { getFolderConfig, hasFolderConfig, countFolderRequests, resolveFolderAuth } from './folder';

const collection: any = {
  info: { name: 'Hotel Booking API' },
  request: { auth: { type: 'bearer', token: '{{token}}' } }
};

describe('resolveFolderAuth', () => {
  it('returns the folder own auth when it is concrete', () => {
    const folder: any = { request: { auth: { type: 'basic', username: 'u' } } };
    expect(resolveFolderAuth(collection, [], folder)).toEqual({ auth: { type: 'basic', username: 'u' } });
  });

  it('resolves inherited auth from the collection with a source', () => {
    const folder: any = { request: { auth: 'inherit' } };
    const resolved = resolveFolderAuth(collection, [], folder);
    expect(resolved.auth).toMatchObject({ type: 'bearer' });
    expect(resolved.source).toEqual({ level: 'collection', name: 'Hotel Booking API' });
  });

  it('resolves inherited auth from the nearest ancestor folder', () => {
    const parent: any = { info: { name: 'Parent' }, request: { auth: { type: 'apikey', key: 'k' } } };
    const folder: any = { request: { auth: 'inherit' } };
    const resolved = resolveFolderAuth(collection, [parent], folder);
    expect(resolved.auth).toMatchObject({ type: 'apikey' });
    expect(resolved.source).toEqual({ level: 'folder', name: 'Parent' });
  });
});

describe('getFolderConfig', () => {
  it('derives headers, auth, scripts and variables from the folder request block', () => {
    const folder: any = {
      request: {
        headers: [
          { name: 'Accept', value: 'application/json' },
          { name: 'X-Disabled', value: 'x', disabled: true }
        ],
        auth: 'inherit',
        variables: [{ name: 'sessionId', value: '{{$randomUUID}}' }],
        scripts: [
          { type: 'before-request', code: 'pre' },
          { type: 'after-response', code: 'post' },
          { type: 'tests', code: 'test()' }
        ]
      }
    };

    const config = getFolderConfig(collection, [], folder);

    expect(config.headers).toEqual([{ name: 'Accept', value: 'application/json', disabled: undefined }]);
    expect(config.auth).toMatchObject({ type: 'bearer' });
    expect(config.authSource).toEqual({ level: 'collection', name: 'Hotel Booking API' });
    expect(config.preRequest).toBe('pre');
    expect(config.postResponse).toBe('post');
    expect(config.tests).toBe('test()');
    expect(config.variables).toEqual([{ name: 'sessionId', value: '{{$randomUUID}}', disabled: undefined }]);
  });

  it('leaves auth undefined when inheritance cannot resolve to a concrete value', () => {
    const folder: any = { request: { auth: 'inherit' } };
    expect(getFolderConfig(null, [], folder).auth).toBeUndefined();
  });
});

describe('hasFolderConfig', () => {
  it('is false for a folder with no configuration', () => {
    const folder: any = { items: [{ info: { type: 'http' } }] };
    expect(hasFolderConfig(getFolderConfig(null, [], folder))).toBe(false);
  });

  it('is true when any configuration is present', () => {
    const folder: any = { request: { scripts: [{ type: 'before-request', code: 'x' }] } };
    expect(hasFolderConfig(getFolderConfig(null, [], folder))).toBe(true);
  });
});

describe('countFolderRequests', () => {
  it('counts request items recursively, excluding folders and scripts', () => {
    const folder: any = {
      items: [
        { info: { type: 'http' } },
        { info: { type: 'script' }, script: '{}' },
        {
          info: { type: 'folder' },
          items: [{ info: { type: 'graphql' } }, { info: { type: 'grpc' } }]
        }
      ]
    };
    expect(countFolderRequests(folder)).toBe(3);
  });

  it('returns zero for an empty folder', () => {
    expect(countFolderRequests({ items: [] } as any)).toBe(0);
    expect(countFolderRequests({} as any)).toBe(0);
  });
});
