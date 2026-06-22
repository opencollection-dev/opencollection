import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { ContentSectionComponent } from './content-section.component';

type StatusTone = 'success' | 'client-error' | 'server-error';

export class ExamplesComponent extends BaseComponent {
  /** Every example tab. */
  readonly tabs = this.root.locator('.example-tab');
  /** The response status badge of the active example. */
  readonly statusBadge = this.root.locator('.status-badge');
  /** The method + URL row of the active example. */
  readonly urlRow = this.root.locator('.example-url-row');
  readonly method = this.urlRow.locator('.example-method');
  readonly url = this.urlRow.locator('.example-url');

  get request(): ContentSectionComponent {
    return new ContentSectionComponent(this.page, this.root.locator('.content-section').first());
  }

  get response(): ContentSectionComponent {
    return new ContentSectionComponent(this.page, this.root.locator('.content-section').nth(1));
  }

  tab(name: string): Locator {
    return this.root.locator('.example-tab', { hasText: name });
  }

  statusBadgeByTone(tone: StatusTone): Locator {
    return this.root.locator(`.status-badge.${tone}`);
  }

  async selectExample(name: string): Promise<void> {
    await this.tab(name).click();
  }
}
