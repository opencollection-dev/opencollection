/** True on macOS/iOS. Pure so it can be tested against a navigator-like object. */
export const isMacPlatform = (
  nav: { platform?: string; userAgent?: string } = typeof navigator !== 'undefined' ? navigator : {},
): boolean => /Mac|iPhone|iPad|iPod/.test(nav.platform || '') || /Mac OS X/.test(nav.userAgent || '');
