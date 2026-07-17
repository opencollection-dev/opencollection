import { describe, it, expect } from 'vitest';
import {
  isDockMode,
  DEFAULT_DOCK,
  PARAM_OPEN,
  PARAM_DOCK,
  PARAM_REQUEST,
  PARAM_EXAMPLE,
  readPlaygroundParams,
  writePlaygroundParams,
} from './playgroundDock';

describe('isDockMode', () => {
  it('accepts the three dock modes', () => {
    expect(isDockMode('inline')).toBe(true);
    expect(isDockMode('bottom')).toBe(true);
    expect(isDockMode('modal')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isDockMode('sidebar')).toBe(false);
    expect(isDockMode('')).toBe(false);
    expect(isDockMode(null)).toBe(false);
    expect(isDockMode(undefined)).toBe(false);
  });
});

describe('readPlaygroundParams', () => {
  it('defaults to closed with the default dock and no request', () => {
    expect(readPlaygroundParams(new URLSearchParams())).toEqual({
      open: false,
      dock: DEFAULT_DOCK,
      requestSlug: null,
      exampleSlug: null,
    });
  });

  it('reads open, dock and request slug from the query', () => {
    expect(readPlaygroundParams(new URLSearchParams('pg=1&dock=inline&pgReq=users/get'))).toEqual({
      open: true,
      dock: 'inline',
      requestSlug: 'users/get',
      exampleSlug: null,
    });
  });

  it('reads the example slug when a request slug is present', () => {
    expect(readPlaygroundParams(new URLSearchParams('pg=1&pgReq=users/get&pgEx=list-users'))).toMatchObject({
      requestSlug: 'users/get',
      exampleSlug: 'list-users',
    });
  });

  it('ignores an example slug when no request slug is present', () => {
    expect(readPlaygroundParams(new URLSearchParams('pg=1&pgEx=orphan')).exampleSlug).toBeNull();
  });

  it('falls back to the default dock for an invalid dock param', () => {
    expect(readPlaygroundParams(new URLSearchParams('pg=1&dock=nope')).dock).toBe(DEFAULT_DOCK);
  });

  it('treats any pg value other than 1 as closed', () => {
    expect(readPlaygroundParams(new URLSearchParams('pg=0')).open).toBe(false);
    expect(readPlaygroundParams(new URLSearchParams('pg=true')).open).toBe(false);
  });
});

describe('writePlaygroundParams', () => {
  it('sets pg, dock and request when opening', () => {
    const next = writePlaygroundParams(new URLSearchParams(), {
      open: true,
      dock: 'modal',
      requestSlug: 'auth/login',
    });
    expect(next.get(PARAM_OPEN)).toBe('1');
    expect(next.get(PARAM_DOCK)).toBe('modal');
    expect(next.get(PARAM_REQUEST)).toBe('auth/login');
  });

  it('clears all playground params when closing but keeps unrelated ones', () => {
    const start = new URLSearchParams('pg=1&dock=modal&pgReq=auth/login&fixture=folders');
    const next = writePlaygroundParams(start, { open: false });
    expect(next.get(PARAM_OPEN)).toBeNull();
    expect(next.get(PARAM_DOCK)).toBeNull();
    expect(next.get(PARAM_REQUEST)).toBeNull();
    expect(next.get('fixture')).toBe('folders');
  });

  it('omits (and clears) the request param when none is given', () => {
    const next = writePlaygroundParams(new URLSearchParams('pgReq=stale'), { open: true, dock: 'bottom' });
    expect(next.get(PARAM_REQUEST)).toBeNull();
  });

  it('round-trips through readPlaygroundParams', () => {
    const next = writePlaygroundParams(new URLSearchParams(), {
      open: true,
      dock: 'inline',
      requestSlug: 'x',
    });
    expect(readPlaygroundParams(next)).toEqual({
      open: true,
      dock: 'inline',
      requestSlug: 'x',
      exampleSlug: null,
    });
  });

  it('sets pgEx alongside pgReq and round-trips the example', () => {
    const next = writePlaygroundParams(new URLSearchParams(), {
      open: true,
      dock: 'bottom',
      requestSlug: 'users/get',
      exampleSlug: 'list-users',
    });
    expect(next.get(PARAM_EXAMPLE)).toBe('list-users');
    expect(readPlaygroundParams(next)).toMatchObject({ requestSlug: 'users/get', exampleSlug: 'list-users' });
  });

  it('drops pgEx when the request slug is cleared', () => {
    const start = new URLSearchParams('pg=1&pgReq=users/get&pgEx=list-users');
    const next = writePlaygroundParams(start, { open: true, dock: 'bottom' });
    expect(next.get(PARAM_REQUEST)).toBeNull();
    expect(next.get(PARAM_EXAMPLE)).toBeNull();
  });

  it('clears pgEx when closing', () => {
    const start = new URLSearchParams('pg=1&pgReq=users/get&pgEx=list-users');
    const next = writePlaygroundParams(start, { open: false });
    expect(next.get(PARAM_EXAMPLE)).toBeNull();
  });

  it('defaults the dock when the param is missing (no persistence)', () => {
    expect(readPlaygroundParams(new URLSearchParams('pg=1')).dock).toBe(DEFAULT_DOCK);
  });
});
