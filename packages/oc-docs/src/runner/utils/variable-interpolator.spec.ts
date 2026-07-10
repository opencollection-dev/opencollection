import { describe, it, expect } from 'vitest';
import type { HttpRequest } from '@opencollection/types/requests/http';
import { interpolateVars } from './variable-interpolator';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const req = (http: Record<string, any>): HttpRequest => ({ http: { method: 'GET', ...http } as any });

describe('interpolateVars — built-in dynamic variables', () => {
  it('resolves {{$randomUUID}} in the URL', () => {
    const out = interpolateVars(req({ url: 'https://api.com/u/{{$randomUUID}}' }));
    expect(out.http!.url).toMatch(/^https:\/\/api\.com\/u\/[0-9a-f-]{36}$/);
  });

  it('resolves {{$timestamp}} to a unix-seconds integer', () => {
    const out = interpolateVars(req({ url: 'x{{$timestamp}}' }));
    expect(out.http!.url!.slice(1)).toMatch(/^\d{10}$/);
  });

  it('resolves {{$isoTimestamp}} to a round-trippable ISO string', () => {
    const out = interpolateVars(req({ url: 'x{{$isoTimestamp}}' }));
    const ts = out.http!.url!.slice(1);
    expect(new Date(ts).toISOString()).toBe(ts);
  });

  it('leaves an unknown {{$foo}} token untouched', () => {
    const out = interpolateVars(req({ url: 'https://api.com/{{$foo}}' }));
    expect(out.http!.url).toBe('https://api.com/{{$foo}}');
  });

  it('resolves a dynamic var in a header value', () => {
    const out = interpolateVars(
      req({ url: 'https://api.com', headers: [{ name: 'X-Id', value: '{{$randomUUID}}' }] })
    );
    expect(out.http!.headers![0].value).toMatch(UUID);
  });

  it('resolves a dynamic var inside a JSON body', () => {
    const out = interpolateVars(
      req({
        url: 'https://api.com',
        headers: [{ name: 'Content-Type', value: 'application/json' }],
        body: { type: 'json', data: '{"id":"{{$randomUUID}}"}' }
      })
    );
    const body = out.http!.body as { data: string };
    expect(JSON.parse(body.data).id).toMatch(UUID);
  });

  it('still resolves regular {{variables}}', () => {
    const out = interpolateVars(req({ url: '{{host}}/ping' }), {
      collectionVariables: { host: 'https://api.com' }
    });
    expect(out.http!.url).toBe('https://api.com/ping');
  });

  it('resolves a dynamic and a regular var in the same string', () => {
    const out = interpolateVars(req({ url: '{{host}}/u/{{$randomUUID}}' }), {
      collectionVariables: { host: 'https://api.com' }
    });
    expect(out.http!.url).toMatch(/^https:\/\/api\.com\/u\/[0-9a-f-]{36}$/);
  });

  it('resolves a dynamic var referenced through a variable value', () => {
    const out = interpolateVars(req({ url: '{{traceId}}' }), {
      collectionVariables: { traceId: '{{$randomUUID}}' }
    });
    expect(out.http!.url).toMatch(UUID);
  });
});
