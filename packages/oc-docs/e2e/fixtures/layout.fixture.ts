import { test as base } from '@playwright/test';
import { LayoutPage } from '@pages/layout.page';

/** Provides the {@link LayoutPage} page object, constructed once per test. */
export const test = base.extend<{ layoutPage: LayoutPage }>({
  layoutPage: async ({ page }, use) => {
    await use(new LayoutPage(page));
  }
});
