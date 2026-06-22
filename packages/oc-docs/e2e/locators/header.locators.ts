import type { Page } from '@playwright/test';

/** Headline: version label + collection name. */
export const buildOverviewHeaderLocators = (page: Page) => ({
  version: () => page.getByTestId('overview-version'),
  title: () => page.getByTestId('overview-title')
});
