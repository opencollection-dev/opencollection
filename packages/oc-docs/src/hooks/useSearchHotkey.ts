import { useEffect } from 'react';
import { isMacPlatform } from '../utils/platform';

/**
 * Platform-aware search shortcut: ⌘K on macOS, Ctrl+K elsewhere. Never hardcodes
 * ⌘ (Windows/Linux users get Ctrl+K).
 */

/** Whether a keydown event is the platform's search shortcut. */
export const matchesSearchHotkey = (
  e: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey'>,
  isMac: boolean,
): boolean => {
  if ((e.key || '').toLowerCase() !== 'k') return false;
  // Require the platform modifier and reject the other, so ⌘K on Windows or
  // Ctrl+K on Mac (different OS shortcuts) don't both fire.
  return isMac ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey;
};

/** True when the event target is a text-editable element, so we don't steal the
 *  shortcut (or preventDefault) while the user is typing in another field. */
export const isEditableTarget = (target: EventTarget | null): boolean => {
  const el = target as (HTMLElement & { tagName?: string }) | null;
  if (!el || typeof el.tagName !== 'string') return false;
  const tag = el.tagName.toUpperCase();
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable === true;
};

/** Attach a document keydown listener that fires `onTrigger` on the shortcut. */
export const useSearchHotkey = (onTrigger: () => void): void => {
  useEffect(() => {
    const isMac = isMacPlatform();
    const onKeyDown = (e: KeyboardEvent) => {
      if (!matchesSearchHotkey(e, isMac)) return;
      // Don't hijack ⌘K/Ctrl+K while the user is typing in another editable field.
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      onTrigger();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onTrigger]);
};
