import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { SecretValueComponent } from '../secret-value.component';

export class ConfigurationSection extends BaseComponent {
  readonly root = this.page.getByTestId('collection-config');

  readonly copyButton = this.root.getByTestId('collection-config-copy').first();

  readonly secret = new SecretValueComponent(this.page, 'collection-config-secret');

  subHeading(name: string): Locator {
    return this.root.getByTestId('collection-config-subheading').filter({ hasText: name });
  }

  row(key: string): Locator {
    return this.root.getByTestId('collection-config-row').filter({ hasText: key });
  }

  rowValue(key: string): Locator {
    return this.row(key).getByTestId('collection-config-row-value');
  }

  async copyToClipboard(): Promise<void> {
    await this.copyButton.click();
  }
}
