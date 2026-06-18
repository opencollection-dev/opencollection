import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Single import point for specs (mirrors how the bruno tests import `test`,
// `expect` and helpers from one place).
export { test, expect };
export * from './locators';

/**
 * Navigate to the docs app and wait for the Overview to finish rendering.
 * The dev server renders the bundled sample collection at `/`.
 */
export const gotoOverview = async (page: Page): Promise<void> => {
  await test.step('Open the docs and wait for the Overview to render', async () => {
    await page.goto('/');
    await page.getByTestId('overview').waitFor({ state: 'visible' });
  });
};
