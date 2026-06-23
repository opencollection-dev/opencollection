import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * A masked secret value with a reveal toggle (the app's SecretValue component).
 *
 * The app builds two test ids from one base id: the value text at `<id>-text` and
 * the toggle button at `<id>-toggle`. Pass that base id and this finds both — so it
 * works for any SecretValue, wherever it's rendered.
 */
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
