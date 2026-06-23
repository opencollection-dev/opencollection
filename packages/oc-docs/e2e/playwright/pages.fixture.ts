import { test as base } from '@playwright/test';
import { CollectionPage } from '../pages/collection.page';
import { ThemeToggleComponent } from '../components/theme-toggle.component';

/**
 * Each page object gets a fixture, and so do the layout components that app use
 * directly.
 */
type Fixtures = {
  collectionPage: CollectionPage;
  themeToggle: ThemeToggleComponent;
};

export const test = base.extend<Fixtures>({
  collectionPage: async ({ page }, use) => {
    await use(new CollectionPage(page));
  },
  themeToggle: async ({ page }, use) => {
    await use(new ThemeToggleComponent(page));
  }
});
