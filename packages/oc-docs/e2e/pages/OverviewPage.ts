import { test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { BasePage } from './BasePage';
import { buildOverviewLocators } from '../locators/locators.locators';

/**
 * Page object for the collection Overview page (the docs app root).
 *
 * Owns the page-level actions (navigation, waiting for render) and exposes the
 * section-grouped locators via {@link OverviewPage.locators}, so specs read as
 * `overview.locators.<section>.<element>()` and never touch raw selectors.
 */
export class OverviewPage extends BasePage {
  /** Section-grouped locators for the Overview page. */
  readonly locators: ReturnType<typeof buildOverviewLocators>;

  constructor(page: Page) {
    super(page);
    this.locators = buildOverviewLocators(page);
  }

  /** Open the docs app and wait for the Overview to finish rendering. */
  async goto(): Promise<void> {
    await test.step('Open the docs and wait for the Overview to render', async () => {
      await this.navigate('/');
      await this.locators.root().waitFor({ state: 'visible' });
    });
  }
}
