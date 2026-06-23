import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';
export class SecretValueComponent extends BaseComponent {
  /** The displayed value — masked (••••) by default, the raw value once revealed. */
  readonly value: Locator;

  /** The show/hide toggle button. */
  readonly toggle: Locator;

  constructor(page: Page, testId: string) {
    super(page);
    this.value = page.getByTestId(`${testId}-text`);
    this.toggle = page.getByTestId(`${testId}-toggle`);
  }

  /** Reveal the raw value. */
  async reveal(): Promise<void> {
    await this.toggle.click();
  }
}
