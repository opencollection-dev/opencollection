import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

// The Auth tab inside the playground request pane: the auth-mode dropdown, its options,
// and the notice shown when a request inherits its auth. Open the tab via
// playground.selectTab('auth').
export class RequestAuthComponent extends BaseComponent {
  readonly modeSelect = this.page.getByTestId('auth-mode-select');
  readonly inheritNotice = this.page.getByTestId('auth-inherit-notice');
  readonly options = this.page.getByTestId(/^auth-mode-select-(?!dropdown$)/);

  option(value: string): Locator {
    return this.page.getByTestId(`auth-mode-select-${value}`);
  }

  async open(): Promise<void> {
    await this.modeSelect.click();
  }

  async selectMode(value: string): Promise<void> {
    await this.modeSelect.click();
    await this.option(value).click();
  }
}
