import type { Page } from '@playwright/test';

/** Stat counters (Requests / Folders / Environments). */
export const buildOverviewStatsLocators = (page: Page) => {
  const item = (label: string) => page.getByTestId('overview-stat').filter({ hasText: label });

  return {
    all: () => page.getByTestId('overview-stat'),
    item,
    value: (label: string) => item(label).getByTestId('overview-stat-value')
  };
};
