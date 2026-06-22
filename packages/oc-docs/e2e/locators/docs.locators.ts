import type { Page } from '@playwright/test';

/** Rendered markdown documentation (body internals matched by role/tag — generated HTML). */
export const buildOverviewDocsLocators = (page: Page) => ({
  content: () => page.getByTestId('overview-docs'),
  heading: (name: string) => page.getByTestId('overview-docs').getByRole('heading', { name }),
  table: () => page.getByTestId('overview-docs').getByRole('table')
});
