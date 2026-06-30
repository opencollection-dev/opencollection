import { describe, it, expect } from 'vitest';
import { matchesSearchHotkey, isEditableTarget } from './useSearchHotkey';

describe('matchesSearchHotkey', () => {
  it('fires on ⌘K on Mac, not Ctrl+K', () => {
    expect(matchesSearchHotkey({ key: 'k', metaKey: true, ctrlKey: false }, true)).toBe(true);
    expect(matchesSearchHotkey({ key: 'k', metaKey: false, ctrlKey: true }, true)).toBe(false);
  });
  it('fires on Ctrl+K off Mac, not ⌘K', () => {
    expect(matchesSearchHotkey({ key: 'k', metaKey: false, ctrlKey: true }, false)).toBe(true);
    expect(matchesSearchHotkey({ key: 'k', metaKey: true, ctrlKey: false }, false)).toBe(false);
  });
  it('is case-insensitive on the key', () => {
    expect(matchesSearchHotkey({ key: 'K', metaKey: true, ctrlKey: false }, true)).toBe(true);
  });
  it('ignores other keys', () => {
    expect(matchesSearchHotkey({ key: 'j', metaKey: true, ctrlKey: false }, true)).toBe(false);
  });
});

describe('isEditableTarget', () => {
  it('is true for input, textarea and select', () => {
    expect(isEditableTarget({ tagName: 'INPUT' } as never)).toBe(true);
    expect(isEditableTarget({ tagName: 'textarea' } as never)).toBe(true);
    expect(isEditableTarget({ tagName: 'SELECT' } as never)).toBe(true);
  });
  it('is true for a contentEditable element', () => {
    expect(isEditableTarget({ tagName: 'DIV', isContentEditable: true } as never)).toBe(true);
  });
  it('is false for non-editable elements and null', () => {
    expect(isEditableTarget({ tagName: 'BUTTON' } as never)).toBe(false);
    expect(isEditableTarget({ tagName: 'DIV', isContentEditable: false } as never)).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
  });
});
