import type { Page } from '@playwright/test';

/**
 * Base class for component objects — reusable, self-contained slices of a page
 * (a header, a list, a config panel). A page object composes these instead of
 * owning every locator itself, which keeps each class small and focused.
 *
 * Subclasses declare fixed locators as `readonly` fields (evaluated lazily by
 * Playwright) and expose parameterized locators as methods.
 */
export abstract class BaseComponent {
  constructor(protected readonly page: Page) {}
}
