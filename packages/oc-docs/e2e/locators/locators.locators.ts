import type { Page } from '@playwright/test';

import { buildOverviewHeaderLocators } from './header.locators';
import { buildOverviewStatsLocators } from './stats.locators';
import { buildOverviewEnvironmentsLocators } from './environments.locators';
import { buildOverviewDocsLocators } from './docs.locators';
import { buildOverviewConfigurationLocators } from './configuration.locators';

/**
 * Locators for the collection Overview page, grouped by UI area.
 *
 * Selection is driven by `data-testid` hooks set from the Overview composition root
 * (so specs are decoupled from styling/markup churn). The only exceptions are the
 * rendered-markdown internals (table, headings, strong/code/blockquote), which are
 * generated HTML with no place for a test id and so are matched by role/tag/text.
 *
 * Each UI area lives in its own `*.locators.ts` file and is composed here. This file
 * also owns the cross-cutting bits (page root, section labels, empty states) and
 * re-exports the per-section builders for specs that only need one area.
 */
export const buildOverviewLocators = (page: Page) => {
  const root = () => page.getByTestId('overview');

  // Build each sub-builder once.
  const header = buildOverviewHeaderLocators(page);
  const stats = buildOverviewStatsLocators(page);
  const environments = buildOverviewEnvironmentsLocators(page);
  const docs = buildOverviewDocsLocators(page);
  const configuration = buildOverviewConfigurationLocators(page);

  return {
    /** The Overview page root. */
    root,

    /** Headline: version label + collection name. */
    header,

    /** Stat counters (Requests / Folders / Environments). */
    stats,

    /** An uppercase section heading (e.g. "Environments", "Collection Configuration"). */
    sectionLabel: (name: string) => page.getByTestId('overview-section-label').filter({ hasText: name }),

    /** Environments list. */
    environments,

    /** Rendered markdown documentation (body internals matched by role/tag — generated HTML). */
    docs,

    /** Collection configuration: headers, auth, scripts and tests. */
    configuration,

    /** Dashed empty-state placeholders (shown when a whole section has no data). */
    emptyState: {
      headings: () => root().getByTestId('overview-empty-heading')
    }
  };
};

export { buildOverviewHeaderLocators } from './header.locators';
export { buildOverviewStatsLocators } from './stats.locators';
export { buildOverviewEnvironmentsLocators } from './environments.locators';
export { buildOverviewDocsLocators } from './docs.locators';
export { buildOverviewConfigurationLocators } from './configuration.locators';
