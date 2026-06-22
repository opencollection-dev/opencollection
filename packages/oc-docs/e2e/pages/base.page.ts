import type { Page, Locator } from '@playwright/test';

/**
 * Base class for every page object.
 *
 * Holds the Playwright `page` handle and the navigation shared by all pages.
 * Concrete pages declare their `root` (the element that signals the page has
 * loaded) and expose their components as `readonly` properties; `goto` and
 * `reload` are inherited, so pages don't repeat the navigate-then-wait boilerplate.
 */
export abstract class BasePage {
  /** The element that signals this page has finished loading (awaited by `goto`). */
  abstract readonly root: Locator;

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
