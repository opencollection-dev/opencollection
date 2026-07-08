import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

/**
 * The environment controls in the page header: the show-variables toggle and
 * the environment switcher. Both are sibling controls in the header's env slot,
 * so the toggle is found page-wide by its test id and the switcher is scoped to
 * its own root. Parts are found by test id or role, never by class.
 */
export class EnvSwitcherComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.getByTestId('env-switcher'));
  }

  readonly showVarsToggle = this.page.getByTestId('show-vars-toggle');
  readonly trigger = this.root.getByTestId('env-switcher-trigger');
  readonly listbox = this.root.getByRole('listbox');

  option(name: string): Locator {
    return this.root.getByTestId(`env-switcher-option-${name}`);
  }

  async open(): Promise<void> {
    await this.trigger.click();
  }

  async selectEnvironment(name: string): Promise<void> {
    await this.open();
    await this.option(name).click();
  }

  async toggle(): Promise<void> {
    await this.showVarsToggle.click();
  }
}
