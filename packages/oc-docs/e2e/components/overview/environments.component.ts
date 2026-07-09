import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class EnvironmentsSection extends BaseComponent {

  readonly items = this.page.getByTestId('overview-environment-item');

  item(name: string): Locator {
    return this.items.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  variableCount(name: string): Locator {
    return this.item(name).getByTestId('overview-environment-item-variable-count');
  }
}
