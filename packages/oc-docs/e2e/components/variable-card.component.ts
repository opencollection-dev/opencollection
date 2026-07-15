import type { Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

export class VariableCardComponent extends BaseComponent {
  readonly card = this.page.getByTestId('variable-info-card');
  readonly name = this.card.getByTestId('variable-info-card-name');
  readonly scopeBadge = this.card.getByTestId('variable-info-card-scope');
  readonly value = this.card.getByTestId('variable-info-card-value');
  readonly copyButton = this.card.getByTestId('variable-info-card-copy');
  readonly revealToggle = this.card.getByTestId('variable-info-card-reveal');
  readonly note = this.card.getByTestId('variable-info-card-note');
  readonly warning = this.card.getByTestId('variable-info-card-warning');

  token(name: string, within?: Locator): Locator {
    return (within ?? this.page).getByTestId(`variable-token-${name}`).first();
  }

  async hoverToken(name: string, within?: Locator): Promise<void> {
    await this.token(name, within).hover();
  }

  async pinToken(name: string, within?: Locator): Promise<void> {
    await this.token(name, within).click();
  }
}
