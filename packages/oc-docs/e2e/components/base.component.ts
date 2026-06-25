import type { Page, Locator } from '@playwright/test';

export abstract class BaseComponent {
  readonly root: Locator;

  constructor(protected readonly page: Page, root?: Locator) {
    this.root = root ?? page.locator(':root');
  }
}
