import { describe, it, expect } from 'vitest';
import reducer, { setExampleHighlight, clearExampleHighlight } from './docsExamples';

describe('docsExamples slice', () => {
  it('starts with no highlight', () => {
    expect(reducer(undefined, { type: '@@init' })).toEqual({ highlight: null });
  });

  it('sets and clears the highlight', () => {
    const set = reducer(undefined, setExampleHighlight({ requestUuid: 'r1', index: 2 }));
    expect(set.highlight).toEqual({ requestUuid: 'r1', index: 2 });
    const cleared = reducer(set, clearExampleHighlight());
    expect(cleared.highlight).toBeNull();
  });
});
