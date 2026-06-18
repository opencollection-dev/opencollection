import type { Page } from '@playwright/test';

/**
 * Locators for the collection Overview page, grouped by UI area.
 *
 * Selection is driven by `data-testid` hooks set from the Overview composition root
 * (so specs are decoupled from styling/markup churn). The only exceptions are the
 * rendered-markdown internals (table, headings, strong/code/blockquote), which are
 * generated HTML with no place for a test id and so are matched by role/tag/text.
 */
export const buildOverviewLocators = (page: Page) => {
  const root = () => page.getByTestId('overview');
  const stat = (label: string) => page.getByTestId('overview-stat').filter({ hasText: label });
  const environment = (name: string) => page.getByTestId('overview-environment').filter({ hasText: name });
  const configuration = () => page.getByTestId('overview-config');

  return {
    /** The Overview page root. */
    root,

    /** Headline: version label + collection name. */
    header: {
      version: () => page.getByTestId('overview-version'),
      title: () => page.getByTestId('overview-title')
    },

    /** Stat counters (Requests / Folders / Environments). */
    stats: {
      all: () => page.getByTestId('overview-stat'),
      item: stat,
      value: (label: string) => stat(label).getByTestId('overview-stat-value')
    },

    /** An uppercase section heading (e.g. "Environments", "Collection Configuration"). */
    sectionLabel: (name: string) => page.getByTestId('overview-section-label').filter({ hasText: name }),

    /** Environments list. */
    environments: {
      list: () => page.getByTestId('overview-environments'),
      items: () => page.getByTestId('overview-environment'),
      item: environment,
      variableCount: (name: string) => environment(name).getByTestId('overview-environment-vars')
    },

    /** Rendered markdown documentation (body internals matched by role/tag — generated HTML). */
    docs: {
      content: () => page.getByTestId('overview-docs'),
      heading: (name: string) => page.getByTestId('overview-docs').getByRole('heading', { name }),
      table: () => page.getByTestId('overview-docs').getByRole('table')
    },

    /** Collection configuration: headers, auth, scripts and tests. */
    configuration: {
      root: configuration,
      subHeading: (name: string) => configuration().getByTestId('overview-config-subheading').filter({ hasText: name }),
      row: (key: string) => configuration().getByTestId('overview-config-row').filter({ hasText: key }),
      rowValue: (key: string) =>
        configuration().getByTestId('overview-config-row').filter({ hasText: key }).getByTestId('overview-config-row-value'),
      emptyMessages: () => configuration().getByTestId('overview-config-empty'),
      copyButtons: () => configuration().getByTestId('overview-config-copy'),
      secret: () => configuration().getByTestId('overview-config-secret-text'),
      revealSecretButton: () => configuration().getByTestId('overview-config-secret-toggle')
    },

    /** Dashed empty-state placeholders (shown when a whole section has no data). */
    emptyState: {
      headings: () => root().getByTestId('overview-empty-heading')
    }
  };
};
