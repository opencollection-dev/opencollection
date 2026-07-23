import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class EnvEditorComponent extends BaseComponent {
  readonly cards = this.page.getByTestId('env-var-cards');
  readonly cardItems = this.cards.locator('.env-card');
  readonly nameInputs = this.cards.getByPlaceholder('Name');
  readonly valueInputs = this.cards.getByPlaceholder('Value');

  /** The per-variable enable/disable checkbox, addressed by the variable name via its aria-label. */
  enableToggle(name: string): Locator {
    return this.cards.getByRole('checkbox', { name: `Enable ${name}` });
  }

  /** The card that owns the named variable, matched via its enable checkbox. */
  cardFor(name: string): Locator {
    return this.cardItems.filter({ has: this.page.getByRole('checkbox', { name: `Enable ${name}` }) });
  }
}
