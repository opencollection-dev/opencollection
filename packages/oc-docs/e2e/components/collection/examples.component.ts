import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { ContentSectionComponent } from './content-section.component';

type StatusTone = 'success' | 'client-error' | 'server-error';

/**
 * The saved request/response examples for one endpoint: a strip of example tabs
 * over a Request pane and a Response pane, with a status badge and method/URL row.
 */
export class ExamplesComponent extends BaseComponent {
  /** Every example tab. */
  readonly tabs = this.root.locator('.example-tab');
  /** The response status badge of the active example. */
  readonly statusBadge = this.root.locator('.status-badge');
  /** The method + URL row of the active example. */
  readonly urlRow = this.root.locator('.example-url-row');
  readonly method = this.urlRow.locator('.example-method');
  readonly url = this.urlRow.locator('.example-url');

  /** The Request pane (first content section). */
  get request(): ContentSectionComponent {
    return new ContentSectionComponent(this.page, this.root.locator('.content-section').first());
  }

  /** The Response pane (second content section). */
  get response(): ContentSectionComponent {
    return new ContentSectionComponent(this.page, this.root.locator('.content-section').nth(1));
  }

  /** An example tab by its label (e.g. "Create User"). */
  tab(name: string): Locator {
    return this.root.locator('.example-tab', { hasText: name });
  }

  /** The status badge filtered to a tone class (success / client-error / server-error). */
  statusBadgeByTone(tone: StatusTone): Locator {
    return this.root.locator(`.status-badge.${tone}`);
  }

  /** Activate an example tab by its label. */
  async selectExample(name: string): Promise<void> {
    await this.tab(name).click();
  }
}
