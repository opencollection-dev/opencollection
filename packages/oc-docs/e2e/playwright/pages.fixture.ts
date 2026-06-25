import { test as base } from '@playwright/test';
import { OverviewPage } from '../pages/overview.page';
import { PageHeaderComponent } from '../components/layout/page-header.component';
import { ThemeToggleComponent } from '../components/theme-toggle.component';

/**
 * Each page object gets a fixture, and so do the layout components specs drive
 * directly — e.g. `pageHeader` and `themeToggle` — so a test writes
 * `pageHeader.brandName` rather than `layout.header.brandName`.
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
