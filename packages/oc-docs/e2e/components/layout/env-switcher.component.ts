import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

/**
 * The environment controls in the page header: the show-variables toggle and
 * the environment switcher. Both are sibling controls in the header's env slot,
 * so the toggle is found page-wide by its test id and the trigger is scoped to
 * the switcher root. The menu renders through MenuDropdown (Tippy), portaled to
 * <body> so it escapes the topbar stacking context and clears the playground
 * docks, so its menu and options are located page-wide. Parts are found by test
 * id or role, never by class.
 */
export class EnvSwitcherComponent extends BaseComponent {
  readonly showVarsToggle = this.page.getByTestId('show-vars-toggle');
  readonly trigger: Locator;
  readonly menu = this.page.getByRole('menu');
  readonly emptyOption = this.option('No environments');

  constructor(
    page: Page,
    private readonly base = 'env-switcher'
  ) {
    super(page, page.getByTestId(`${base}-root`));
    this.trigger = this.root.getByTestId(base);
  }

  option(name: string): Locator {
    return this.menu.getByRole('menuitem', { name });
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

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }
}
