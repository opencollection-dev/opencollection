import type { Page } from '@playwright/test';

/**
 * Base class for every page object.
 *
 * Holds the Playwright `page` handle and the primitives shared by all pages
 * (navigation today; common waits/dialog helpers can land here later). Concrete
 * pages — {@link OverviewPage} and the others we add under `pages/` — extend this,
 * compose their section locators, and expose page-level actions as methods.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to a path on the docs app (defaults to the app root). */
  protected async navigate(path = '/'): Promise<void> {
    await this.page.goto(path);
  }
}
