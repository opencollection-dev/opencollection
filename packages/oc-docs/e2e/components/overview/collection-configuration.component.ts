import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { SecretValueComponent } from '../secret-value.component';

/** Collection configuration panel on the overview: headers, auth, scripts and tests groups. */
export class CollectionConfigurationComponent extends BaseComponent {
  /** The panel root; all other locators are scoped within it. */
  readonly root = this.page.getByTestId('collection-config');

  /** The masked collection-level auth (bearer) token. */
  readonly secret = new SecretValueComponent(this.page, 'collection-config-auth-secret');

  /** Copy button on the collection-level tests snippet. */
  readonly copyButton = this.root.getByTestId('collection-config-tests-copy');

  /** A group sub-heading (e.g. "Headers", "Auth", "Script", "Tests"). */
  subHeading(name: string): Locator {
    return this.root.getByTestId('collection-config-subheading').filter({ hasText: name });
  }

  /** Copy the tests snippet to the clipboard. */
  async copyToClipboard(): Promise<void> {
    await this.copyButton.click();
  }
}
