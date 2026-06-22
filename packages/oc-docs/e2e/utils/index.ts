import { test, expect } from '@playwright/test';

// Single import point for specs (mirrors how the bruno tests import `test` and
// `expect` from one place). Page-level navigation and waits live on the page
// objects under `pages/`; section locators live under `locators/`.
export { test, expect };
