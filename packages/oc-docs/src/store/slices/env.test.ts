import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import reducer, {
  setActiveEnv,
  setShowVars,
  toggleShowVars,
  readPersistedEnv,
  persistEnv,
  ENV_STORAGE_KEY
} from './env';

beforeAll(() => {
  let store: Record<string, string> = {};
  vi.stubGlobal('sessionStorage', {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; }
  });
});

describe('envSlice', () => {
  it('defaults to no active env and showVars off', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({ activeEnvName: null, showVars: false });
  });

  it('setActiveEnv sets the active environment name', () => {
    expect(reducer(undefined, setActiveEnv('Production')).activeEnvName).toBe('Production');
    expect(reducer({ activeEnvName: 'Production', showVars: false }, setActiveEnv(null)).activeEnvName).toBeNull();
  });

  it('setShowVars sets the flag explicitly', () => {
    expect(reducer(undefined, setShowVars(true)).showVars).toBe(true);
    expect(reducer({ activeEnvName: null, showVars: true }, setShowVars(false)).showVars).toBe(false);
  });

  it('toggleShowVars flips the flag', () => {
    expect(reducer(undefined, toggleShowVars()).showVars).toBe(true);
    expect(reducer({ activeEnvName: null, showVars: true }, toggleShowVars()).showVars).toBe(false);
  });

  it('keeps the two fields independent', () => {
    const next = reducer(reducer(undefined, setActiveEnv('Dev')), toggleShowVars());
    expect(next).toEqual({ activeEnvName: 'Dev', showVars: true });
  });
});

describe('envSlice persistence (sessionStorage)', () => {
  beforeEach(() => sessionStorage.clear());

  it('readPersistedEnv returns defaults when nothing is stored', () => {
    expect(readPersistedEnv()).toEqual({ activeEnvName: null, showVars: false });
  });

  it('persistEnv round-trips the selection', () => {
    persistEnv({ activeEnvName: 'Prod', showVars: true });
    expect(readPersistedEnv()).toEqual({ activeEnvName: 'Prod', showVars: true });
  });

  it('persists whatever on/off state was set, including off', () => {
    persistEnv({ activeEnvName: 'Dev', showVars: false });
    expect(readPersistedEnv().showVars).toBe(false);
  });

  it('ignores malformed stored data', () => {
    sessionStorage.setItem(ENV_STORAGE_KEY, '{not json');
    expect(readPersistedEnv()).toEqual({ activeEnvName: null, showVars: false });
  });
});
