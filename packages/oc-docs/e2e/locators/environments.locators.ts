import type { Page } from '@playwright/test';

/** Environments list. */
export const buildOverviewEnvironmentsLocators = (page: Page) => {
  const item = (name: string) => page.getByTestId('overview-environment').filter({ hasText: name });

  return {
    list: () => page.getByTestId('overview-environments'),
    items: () => page.getByTestId('overview-environment'),
    item,
    variableCount: (name: string) => item(name).getByTestId('overview-environment-vars')
  };
};
