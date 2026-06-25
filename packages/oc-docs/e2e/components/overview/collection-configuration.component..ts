import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { SecretValueComponent } from '../secret-value.component';

export class ConfigurationSection extends BaseComponent {
  readonly root = this.page.getByTestId('collection-config');

  readonly copyButton = this.root.getByTestId('collection-config-tests-copy');

  readonly secret = new SecretValueComponent(this.page, 'collection-config-auth-secret');

  subHeading(name: string): Locator {
    return this.root.getByTestId('collection-config-subheading').filter({ hasText: name });
  }

  async copyToClipboard(): Promise<void> {
    await this.copyButton.click();
  }
}
