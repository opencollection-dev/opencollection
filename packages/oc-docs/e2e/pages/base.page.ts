import type { Page } from '@playwright/test';

/**
 * Base class for every page object.
 *
 * Holds the Playwright `page` handle and the primitives shared by all pages
 * (navigation, reload). Concrete pages extend this, expose their components as
 * `readonly` properties, and add page-level actions (`goto`, flows) as async methods.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to a path on the docs app (defaults to the app root). */
  protected async navigate(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Reload the current page. */
  async reload(): Promise<void> {
    await this.page.reload();
  }
}
