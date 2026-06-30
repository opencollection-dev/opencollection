import type { Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

export class SidebarComponent extends BaseComponent {
  readonly items = this.page.getByTestId('sidebar-item');

  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async open(paths: string[]): Promise<void> {
    for (const name of paths) {
      await this.item(name).first().click();
    }
  }
}
