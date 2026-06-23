import type { Page } from '@playwright/test';

/**
 * Base class for every page object. Holds the Playwright `page` handle, the app
 * mount root, and the navigation shared by all pages.
 */
export abstract class BasePage {
  readonly root = this.page.locator('#root');

  constructor(protected readonly page: Page) {}

  /** Navigate to a path on the docs app (defaults to the app root). */
  protected async navigate(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Open a path on the docs app (defaults to the root) and wait for it to render. */
  async goto(path = '/'): Promise<void> {
    await this.navigate(path);
    await this.root.waitFor({ state: 'visible' });
  }

  /** Reload the current page. */
  async reload(): Promise<void> {
    await this.page.reload();
  }
}
