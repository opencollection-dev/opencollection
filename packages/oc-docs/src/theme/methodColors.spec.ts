import { describe, it, expect } from 'vitest';
import { methodColorVars, getMethodColorVar } from './methodColors';

describe('getMethodColorVar', () => {
  it('maps a standard method to its theme var', () => {
    expect(getMethodColorVar('GET')).toBe('var(--oc-request-methods-get)');
    expect(getMethodColorVar('POST')).toBe('var(--oc-request-methods-post)');
  });

  it('matches methods case-insensitively', () => {
    expect(getMethodColorVar('get')).toBe(methodColorVars.GET);
    expect(getMethodColorVar('Post')).toBe(methodColorVars.POST);
  });

  it('falls back to the muted var for a non-standard method', () => {
    expect(getMethodColorVar('PURGE')).toBe('var(--oc-colors-text-muted)');
  });

  it('falls back to the muted var for an empty or missing method', () => {
    expect(getMethodColorVar('')).toBe('var(--oc-colors-text-muted)');
    expect(getMethodColorVar()).toBe('var(--oc-colors-text-muted)');
  });
});
