import { describe, it, expect } from 'vitest';
import reducer, {
  setViewMode,
  setSelectedExampleIndex,
  clearPlaygroundCollection,
} from './playground';

describe('playground example view', () => {
  it('accepts the example view mode', () => {
    const s = reducer(undefined, setViewMode('example'));
    expect(s.viewMode).toBe('example');
  });

  it('sets and resets the selected example index', () => {
    const set = reducer(undefined, setSelectedExampleIndex(3));
    expect(set.selectedExampleIndex).toBe(3);
    const cleared = reducer(set, clearPlaygroundCollection());
    expect(cleared.selectedExampleIndex).toBeNull();
  });
});
