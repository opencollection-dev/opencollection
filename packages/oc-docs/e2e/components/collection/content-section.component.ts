import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class ContentSectionComponent extends BaseComponent {
  readonly label = this.root.locator('.content-label');

  readonly bodyContent = this.root.locator('.body-content');

  readonly headersTable = this.root.locator('.headers-table');

  toggle(tab: 'Body' | 'Headers' | 'Params'): Locator {
    return this.root.locator('.toggle-btn', { hasText: tab });
  }

  async show(tab: 'Body' | 'Headers' | 'Params'): Promise<void> {
    await this.toggle(tab).click();
  }
}
