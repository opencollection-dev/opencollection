import type { Page, Locator } from '@playwright/test';

export abstract class BaseComponent {
  /** The element this component is scoped to. */
  readonly root: Locator;

  constructor(protected readonly page: Page, root?: Locator) {
    this.root = root ?? page.locator(':root');
  }
}
