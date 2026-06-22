import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

/**
 * One pane of an example — the Request or the Response side. Each has a label, a
 * Body/Headers(/Params) toggle, a rendered body and a headers/params table.
 */
export class ContentSectionComponent extends BaseComponent {
  /** "Request" / "Response" label. */
  readonly label = this.root.locator('.content-label');
  /** The rendered body (JSON/XML/etc.). */
  readonly bodyContent = this.root.locator('.body-content');
  /** The headers (or params) key/value table shown on the Headers/Params tab. */
  readonly headersTable = this.root.locator('.headers-table');

  /** A Body / Headers / Params toggle button. */
  toggle(tab: 'Body' | 'Headers' | 'Params'): Locator {
    return this.root.locator('.toggle-btn', { hasText: tab });
  }

  /** Switch this pane to the given tab. */
  async show(tab: 'Body' | 'Headers' | 'Params'): Promise<void> {
    await this.toggle(tab).click();
  }
}
