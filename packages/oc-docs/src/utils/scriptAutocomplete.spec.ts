import { describe, it, expect } from 'vitest';
import { getScriptApiCompletions, STATIC_API_HINTS } from './scriptAutocomplete';

describe('getScriptApiCompletions', () => {
  it('suggests the enabled roots at the top level', () => {
    expect(getScriptApiCompletions('', ['req', 'bru'])).toEqual(['req', 'bru']);
    expect(getScriptApiCompletions('', ['req', 'res', 'bru'])).toEqual(['req', 'res', 'bru']);
  });

  it('filters roots by the partial word, prefix-first', () => {
    expect(getScriptApiCompletions('re', ['req', 'res', 'bru'])).toEqual(['req', 'res']);
    expect(getScriptApiCompletions('bru', ['req', 'bru'])).toEqual(['bru']);
  });

  it('lists the immediate members after a dot', () => {
    const members = getScriptApiCompletions('bru.', ['req', 'bru']);
    expect(members).toContain('getEnvVar(key)');
    expect(members).toContain('setVar(key,value)');
    expect(members).toContain('cookies');
    expect(members).toContain('runner');
    expect(members).toContain('utils');
    // Only the next segment is offered, never the full dotted path.
    expect(members).not.toContain('cookies.get(name)');
    expect(members).not.toContain('bru.getEnvVar(key)');
  });

  it('filters members by the partial after the dot', () => {
    const members = getScriptApiCompletions('bru.getEnv', ['req', 'bru']);
    expect(members).toContain('getEnvVar(key)');
    expect(members).toContain('getEnvName()');
    expect(members).not.toContain('setVar(key,value)');
  });

  it('walks nested namespaces', () => {
    const cookies = getScriptApiCompletions('bru.cookies.', ['bru']);
    expect(cookies).toContain('get(name)');
    expect(cookies).toContain('jar()');

    const headers = getScriptApiCompletions('req.headerList.', ['req']);
    expect(headers).toContain('get(name)');
    expect(headers).toContain('add(headerObj)');
  });

  it('gates members by the editor\'s allowed roots', () => {
    // Pre-request editor exposes only req/bru — res.* must stay silent.
    expect(getScriptApiCompletions('res.', ['req', 'bru'])).toEqual([]);
    // Post-response / tests editors expose res.
    expect(getScriptApiCompletions('res.', ['req', 'res', 'bru'])).toContain('getStatus()');
  });

  it('returns nothing without enabled roots', () => {
    expect(getScriptApiCompletions('bru.', [])).toEqual([]);
  });

  it('does not complete inside a {{variable}} token (matches Bruno script editors)', () => {
    expect(getScriptApiCompletions('const x = {{bru', ['req', 'res', 'bru'])).toEqual([]);
    expect(getScriptApiCompletions('{{', ['req', 'res', 'bru'])).toEqual([]);
  });

  it('does not treat an unrelated word or a post-call member as an API path', () => {
    expect(getScriptApiCompletions('const', ['req', 'res', 'bru'])).toEqual([]);
    expect(getScriptApiCompletions('foo.', ['req', 'res', 'bru'])).toEqual([]);
    expect(getScriptApiCompletions('foo().', ['bru'])).toEqual([]);
  });

  it('keeps the API hint lists free of duplicates', () => {
    for (const root of Object.keys(STATIC_API_HINTS) as (keyof typeof STATIC_API_HINTS)[]) {
      const hints = STATIC_API_HINTS[root];
      expect(new Set(hints).size).toBe(hints.length);
    }
  });
});
