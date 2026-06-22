import { test as base } from '@playwright/test';
import { CollectionPage } from '@pages/collection.page';

/** Provides the {@link CollectionPage} page object, constructed once per test. */
export const test = base.extend<{ collectionPage: CollectionPage }>({
  collectionPage: async ({ page }, use) => {
    await use(new CollectionPage(page));
  }
});
