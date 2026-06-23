import { test as base } from '@playwright/test';
import { OverviewPage } from '../pages/overview.page';
import { ThemeToggleComponent } from '../components/theme-toggle.component';

/**
 * Each page object gets a fixture, and so do the common components specs drive
 * directly — the theme switch today, the sidebar and page header when they're added.
 */
type Fixtures = {
  overviewPage: OverviewPage;
  themeToggle: ThemeToggleComponent;
};

export const test = base.extend<Fixtures>({
  overviewPage: async ({ page }, use) => {
    await use(new OverviewPage(page));
  },
  themeToggle: async ({ page }, use) => {
    await use(new ThemeToggleComponent(page));
  }
});
