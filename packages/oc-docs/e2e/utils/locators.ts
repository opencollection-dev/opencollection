import type { Page } from '@playwright/test';

/**
 * Locators for the collection Overview page, grouped by UI area.
 *
 * Mirrors the `buildCommonLocators` pattern from the bruno tests: a single
 * builder returns thunks organised by section, so specs read declaratively and
 * every selector lives in one place. Prefers semantic role/text queries and
 * falls back to the components' own stable class hooks.
 */
export const buildOverviewLocators = (page: Page) => {
  const root = () => page.locator('.oc-overview');
  const stat = (label: string) => root().locator('.collection-stats .stat').filter({ hasText: label });
  const environment = (name: string) => root().locator('.environment-summary-item').filter({ hasText: name });
  const configuration = () => root().locator('.collection-configuration');

  return {
    /** The Overview page root. */
    root,

    /** Headline: version label + collection name. */
    header: {
      version: () => root().locator('.overview-version'),
      title: () => root().locator('.overview-headline').getByRole('heading', { level: 1 })
    },

    /** Stat counters (Requests / Folders / Environments). */
    stats: {
      all: () => root().locator('.collection-stats .stat'),
      item: stat,
      value: (label: string) => stat(label).locator('.stat-value')
    },

    /** An uppercase section heading (e.g. "Environments", "Collection Configuration"). */
    sectionLabel: (name: string) => root().getByRole('heading', { level: 2, name }),

    /** Environments list. */
    environments: {
      list: () => root().locator('.environment-summary'),
      items: () => root().locator('.environment-summary-item'),
      item: environment,
      variableCount: (name: string) => environment(name).locator('.environment-summary-vars')
    },

    /** Rendered markdown documentation. */
    docs: {
      content: () => root().locator('.overview-markdown'),
      heading: (name: string) => root().locator('.overview-markdown').getByRole('heading', { name }),
      table: () => root().locator('.overview-markdown table')
    },

    /** Collection configuration: headers, auth, scripts and tests. */
    configuration: {
      root: configuration,
      subHeading: (name: string) => configuration().getByRole('heading', { level: 3, name, exact: true }),
      row: (key: string) => configuration().locator('.config-row').filter({ hasText: key }),
      rowValue: (key: string) => configuration().locator('.config-row').filter({ hasText: key }).locator('.config-value-cell'),
      emptyMessages: () => configuration().locator('.config-empty-message'),
      copyButtons: () => configuration().locator('.copy-button'),
      secret: () => configuration().locator('.secret-value-text'),
      revealSecretButton: () => configuration().locator('.secret-value-toggle')
    },

    /** Dashed empty-state placeholders (shown when a whole section has no data). */
    emptyState: {
      headings: () => root().locator('.empty-state-heading')
    }
  };
};
