import { test as base } from '@playwright/test';
import { OverviewPage } from '../pages/overview.page';
import { PageHeaderComponent } from '../components/layout/page-header.component';
import { ThemeToggleComponent } from '../components/theme-toggle.component';

/**
 * Registers the page objects and shared components as Playwright fixtures, so a
 * spec receives a ready instance by destructuring (e.g. `{ pageHeader }`) and
 * calls `pageHeader.brandName` directly instead of constructing it.
 */
type Fixtures = {
  overviewPage: OverviewPage;
  pageHeader: PageHeaderComponent;
  themeToggle: ThemeToggleComponent;
};

export const test = base.extend<Fixtures>({
  overviewPage: async ({ page }, use) => {
    await use(new OverviewPage(page));
  },
  pageHeader: async ({ page }, use) => {
    await use(new PageHeaderComponent(page));
  },
  themeToggle: async ({ page }, use) => {
    await use(new ThemeToggleComponent(page));
  }
});
