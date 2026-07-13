import { readPersistedMode } from '@slices/theme';

/** Set data-theme on the root element before first paint to avoid a flash. */
export function applyTheme(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', readPersistedMode());
}
