import { useCallback, useState } from 'react';

export type StorageArea = 'local' | 'session';
export type SetStoredValue<T> = (value: T | ((prev: T) => T)) => void;

export const readStored = <T>(storage: Storage | null, key: string, fallback: T): T => {
  if (!storage || !key) return fallback;
  try {
    const raw = storage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
};

export const writeStored = (storage: Storage | null, key: string, value: unknown): void => {
  if (!storage || !key) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // storage may be full or unavailable — keep the in-memory value
  }
};

export const areaFor = (area: StorageArea): Storage | null => {
  if (typeof window === 'undefined') return null;
  return area === 'local' ? window.localStorage : window.sessionStorage;
};

export function useStorage<T>(area: StorageArea, key: string, initialValue: T): [T, SetStoredValue<T>] {
  const [value, setValue] = useState<T>(() => readStored(areaFor(area), key, initialValue));

  const setStored = useCallback<SetStoredValue<T>>(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        writeStored(areaFor(area), key, resolved);
        return resolved;
      });
    },
    [area, key]
  );

  return [value, setStored];
}

export const useLocalStorage = <T>(key: string, initialValue: T): [T, SetStoredValue<T>] =>
  useStorage('local', key, initialValue);

export const useSessionStorage = <T>(key: string, initialValue: T): [T, SetStoredValue<T>] =>
  useStorage('session', key, initialValue);
