import { describe, it, expect } from 'vitest';
import { methodColorVars, availableMethods, getMethodColorVar } from './methodColors';

const MUTED = 'var(--oc-colors-text-muted)';

describe('availableMethods', () => {
  it('is the list of HTTP methods offered in the request dropdown', () => {
    expect(availableMethods).toEqual(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']);
  });

  // non-HTTP protocols are not offered (the dropdown maps over this list).
  it.each(['GRAPHQL', 'GQL', 'GRPC', 'WEBSOCKET', 'WS'])('excludes the non-HTTP protocol %s', (protocol) => {
    expect(availableMethods).not.toContain(protocol);
  });
});

describe('getMethodColorVar', () => {
  it('returns the token for a known method, case-insensitively', () => {
    expect(getMethodColorVar('GET')).toBe('var(--oc-request-methods-get)');
    expect(getMethodColorVar('post')).toBe('var(--oc-request-methods-post)');
    expect(getMethodColorVar('Delete')).toBe('var(--oc-request-methods-delete)');
  });

  it('still resolves colours for non-HTTP protocols kept in the map', () => {
    expect(getMethodColorVar('GRAPHQL')).toBe(methodColorVars.GRAPHQL);
    expect(getMethodColorVar('ws')).toBe(methodColorVars.WS);
  });

  it('falls back to the muted token for unknown or missing methods', () => {
    expect(getMethodColorVar('FOOBAR')).toBe(MUTED);
    expect(getMethodColorVar('')).toBe(MUTED);
    expect(getMethodColorVar(undefined)).toBe(MUTED);
  });
});
