import type { Page, Locator } from '@playwright/test';

export abstract class BaseComponent {
  /**
   * The element this component is scoped to. Section components receive their
   * container; page-wide controls omit it and default to the whole page.
   */
  readonly root: Locator;

  constructor(protected readonly page: Page, root?: Locator) {
    this.root = root ?? page.locator(':root');
  }
}
