import { describe, it, expect } from 'vitest';
import { readStored, writeStored } from './useStorage';
import { fakeStorage } from '../test-utils/storage';

describe('readStored', () => {
  it('falls back to the default value when the key has never been written', () => {
    expect(readStored(fakeStorage(), 'k', { open: true })).toEqual({ open: true });
  });

  it('deserialises and returns the JSON value previously written under the key', () => {
    const storage = fakeStorage();
    storage.setItem('k', JSON.stringify({ open: false }));
    expect(readStored(storage, 'k', { open: true })).toEqual({ open: false });
  });

  it('falls back to the default value (rather than throwing) when the stored value is not valid JSON', () => {
    const storage = fakeStorage();
    storage.setItem('k', '{not json');
    expect(readStored(storage, 'k', 42)).toBe(42);
  });

  it('falls back to the default value when storage is unavailable (SSR) or the key is empty', () => {
    expect(readStored(null, 'k', 'x')).toBe('x');
    expect(readStored(fakeStorage(), '', 'x')).toBe('x');
  });
});

describe('writeStored', () => {
  it('JSON-serialises the value and stores it under the key', () => {
    const storage = fakeStorage();
    writeStored(storage, 'count', 3);
    expect(JSON.parse(storage.getItem('count')!)).toBe(3);
  });

  it('writes nothing when storage is unavailable (SSR) or the key is empty', () => {
    const storage = fakeStorage();
    writeStored(null, 'k', 1);
    writeStored(storage, '', 1);
    expect(storage.length).toBe(0);
  });
});
