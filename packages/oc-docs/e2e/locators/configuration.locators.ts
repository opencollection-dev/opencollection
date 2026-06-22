import type { Page } from '@playwright/test';

/** Collection configuration: headers, auth, scripts and tests. */
export const buildOverviewConfigurationLocators = (page: Page) => {
  const root = () => page.getByTestId('overview-config');

  return {
    root,
    subHeading: (name: string) => root().getByTestId('overview-config-subheading').filter({ hasText: name }),
    row: (key: string) => root().getByTestId('overview-config-row').filter({ hasText: key }),
    rowValue: (key: string) =>
      root().getByTestId('overview-config-row').filter({ hasText: key }).getByTestId('overview-config-row-value'),
    emptyMessages: () => root().getByTestId('overview-config-empty'),
    copyButtons: () => root().getByTestId('overview-config-copy'),
    secret: () => root().getByTestId('overview-config-secret-text'),
    revealSecretButton: () => root().getByTestId('overview-config-secret-toggle')
  };
};
