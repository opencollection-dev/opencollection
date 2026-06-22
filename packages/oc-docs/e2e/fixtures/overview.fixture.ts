import { test as base } from '@playwright/test';
import { OverviewPage } from '@pages/overview.page';

/** Provides the {@link OverviewPage} page object, constructed once per test. */
export const test = base.extend<{ overviewPage: OverviewPage }>({
  overviewPage: async ({ page }, use) => {
    await use(new OverviewPage(page));
  }
});
