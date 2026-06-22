import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

/** Collection configuration panel: headers, auth, scripts and tests groups. */
export class CollectionConfigurationComponent extends BaseComponent {
  /** The panel root; all other locators are scoped within it. */
  readonly root = this.page.getByTestId('overview-config');
  readonly emptyMessages = this.root.getByTestId('overview-config-empty');
  readonly copyButtons = this.root.getByTestId('overview-config-copy');
  readonly secret = this.root.getByTestId('overview-config-secret-text');
  readonly revealSecretButton = this.root.getByTestId('overview-config-secret-toggle');

  /** A group sub-heading (e.g. "Headers", "Auth", "Script", "Tests"). */
  subHeading(name: string): Locator {
    return this.root.getByTestId('overview-config-subheading').filter({ hasText: name });
  }

  /** A config row matched by its key text. */
  row(key: string): Locator {
    return this.root.getByTestId('overview-config-row').filter({ hasText: key });
  }

  /** The value cell of a config row. */
  rowValue(key: string): Locator {
    return this.row(key).getByTestId('overview-config-row-value');
  }

  /** Reveal the masked auth token. */
  async revealSecret(): Promise<void> {
    await this.revealSecretButton.click();
  }
}
