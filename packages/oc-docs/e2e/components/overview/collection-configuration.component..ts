import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class ConfigurationSection extends BaseComponent {
  readonly root = this.page.getByTestId('collection-config');

  subHeading(name: string): Locator {
    return this.root.getByTestId('collection-config-subheading').filter({ hasText: name });
  }
}
