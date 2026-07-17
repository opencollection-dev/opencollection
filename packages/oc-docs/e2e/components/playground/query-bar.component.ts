import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class QueryBarComponent extends BaseComponent {
  readonly methodSelect = this.page.getByTestId('method-select');
  readonly methodLabel = this.methodSelect.locator('.method-select-label');
  readonly methodDropdown = this.page.getByTestId('method-select-dropdown');
  readonly methodAddCustom = this.page.getByTestId('method-select-add-custom');
  readonly methodCustomInput = this.page.getByTestId('method-custom-input');

  methodItem(method: string): Locator {
    return this.page.getByTestId(`method-select-${method.toLowerCase()}`);
  }

  async openMethodDropdown(): Promise<void> {
    await this.methodSelect.click();
  }

  async enterCustomMode(): Promise<void> {
    await this.openMethodDropdown();
    await this.methodAddCustom.click();
  }

  async selectMethod(method: string): Promise<void> {
    await this.openMethodDropdown();
    await this.methodItem(method).click();
  }
}
