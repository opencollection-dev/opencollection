import { test as base } from '@playwright/test';
import { CollectionPage } from '../pages/collection.page';
import { PageHeaderComponent } from '../components/page-header.component';
import { ThemeToggleComponent } from '../components/theme-toggle.component';

/**
 * Each page object gets a fixture, and so do the layout components the app uses
 * directly — e.g. `pageHeader` (and `themeToggle`) — so a test writes
 * `pageHeader.brandName` rather than `layout.header.brandName`.
 */
type Fixtures = {
  collectionPage: CollectionPage;
  pageHeader: PageHeaderComponent;
  themeToggle: ThemeToggleComponent;
};

export const test = base.extend<Fixtures>({
  collectionPage: async ({ page }, use) => {
    await use(new CollectionPage(page));
  },
  pageHeader: async ({ page }, use) => {
    await use(new PageHeaderComponent(page));
  },
  themeToggle: async ({ page }, use) => {
    await use(new ThemeToggleComponent(page));
  }
});
