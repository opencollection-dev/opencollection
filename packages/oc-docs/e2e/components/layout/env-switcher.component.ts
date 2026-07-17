import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

/**
 * The environment controls in the page header: the show-variables toggle and
 * the environment switcher. Both are sibling controls in the header's env slot,
 * so the toggle is found page-wide by its test id and the trigger is scoped to
 * the switcher root. The open popover is portaled to <body> (so it escapes the
 * topbar stacking context and clears the playground docks), so its listbox and
 * options are located page-wide. Parts are found by test id or role, never by class.
 */
export class EnvSwitcherComponent extends BaseComponent {
  readonly showVarsToggle = this.page.getByTestId('show-vars-toggle');
  readonly trigger: Locator;
  readonly listbox = this.page.getByRole('listbox', { name: 'Environments' });

  constructor(
    page: Page,
    private readonly base = 'env-switcher'
  ) {
    super(page, page.getByTestId(base));
    this.trigger = this.root.getByTestId(`${base}-trigger`);
  }

  option(name: string): Locator {
    return this.page.getByTestId(`${this.base}-option-${name}`);
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
