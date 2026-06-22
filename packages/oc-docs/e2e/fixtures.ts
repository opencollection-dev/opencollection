import { test as base, expect } from '@playwright/test';
import { OverviewPage } from './pages/OverviewPage';

/**
 * Page objects exposed to specs as fixtures. Each is constructed once per test
 * and injected by name, so specs declare what they need
 * (`test('…', async ({ overviewPage }) => …)`) instead of `new`-ing page objects.
 */
interface PageObjects {
  overviewPage: OverviewPage;
}

/** The project `test`: Playwright's base test extended with our page-object fixtures. */
export const test = base.extend<PageObjects>({
  overviewPage: async ({ page }, use) => {
    await use(new OverviewPage(page));
  }
});

export { expect };
