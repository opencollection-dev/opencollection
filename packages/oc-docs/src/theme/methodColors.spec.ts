import { describe, it, expect } from 'vitest';
import { methodColorVars, getMethodColorVar } from './methodColors';

const MUTED = 'var(--oc-colors-text-muted)';

describe('methodColorVars', () => {
  it('maps every supported HTTP method to a theme token', () => {
    expect(Object.keys(methodColorVars).sort()).toEqual(
      ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'].sort()
    );
  });

  // BRU-3833: non-HTTP protocols are excluded (the dropdown is built from these keys).
  it.each(['GRAPHQL', 'GQL', 'GRPC', 'WEBSOCKET', 'WS'])(
    'does not expose the non-HTTP protocol %s',
    (protocol) => {
      expect(methodColorVars).not.toHaveProperty(protocol);
    }
  );
});

describe('getMethodColorVar', () => {
  it('returns the token for a known method, case-insensitively', () => {
    expect(getMethodColorVar('GET')).toBe('var(--oc-request-methods-get)');
    expect(getMethodColorVar('post')).toBe('var(--oc-request-methods-post)');
    expect(getMethodColorVar('Delete')).toBe('var(--oc-request-methods-delete)');
  });

  it('falls back to the muted token for now-unsupported protocols', () => {
    expect(getMethodColorVar('GRAPHQL')).toBe(MUTED);
    expect(getMethodColorVar('grpc')).toBe(MUTED);
    expect(getMethodColorVar('WS')).toBe(MUTED);
  });

  it('falls back to the muted token for unknown or missing methods', () => {
    expect(getMethodColorVar('FOOBAR')).toBe(MUTED);
    expect(getMethodColorVar('')).toBe(MUTED);
    expect(getMethodColorVar(undefined)).toBe(MUTED);
  });
});
