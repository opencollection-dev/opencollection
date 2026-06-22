import { test as base } from '@playwright/test';
import { LayoutPage } from '@pages/layout.page';
import { CollectionPage } from '@pages/collection.page';

type PageObjects = {
  layoutPage: LayoutPage;
  collectionPage: CollectionPage;
};

export const test = base.extend<PageObjects>({
  layoutPage: async ({ page }, use) => {
    await use(new LayoutPage(page));
  },
  collectionPage: async ({ page }, use) => {
    await use(new CollectionPage(page));
  }
});

export { expect } from '@playwright/test';
