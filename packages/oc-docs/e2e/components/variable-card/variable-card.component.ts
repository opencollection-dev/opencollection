import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class VariableCardComponent extends BaseComponent {
  readonly card = this.page.getByTestId('variable-info-card');
  readonly name = this.card.getByTestId('variable-info-card-name');
  readonly scopeBadge = this.card.getByTestId('variable-info-card-scope');
  readonly value = this.card.getByTestId('variable-info-card-value');
  readonly copyButton = this.card.getByTestId('variable-info-card-copy');
  readonly revealToggle = this.card.getByTestId('variable-info-card-reveal');
  readonly note = this.card.getByTestId('variable-info-card-note');
  readonly warning = this.card.getByTestId('variable-info-card-warning');
  readonly editors = this.card.locator('textarea, input, .CodeMirror');

  constructor(page: Page, private readonly tokenScope: Page | Locator = page) {
    super(page);
  }

  token(name: string): Locator {
    return this.tokenScope.getByTestId(`variable-token-${name}`).first();
  }

  async hoverToken(name: string): Promise<void> {
    await this.token(name).hover();
  }

  async pinToken(name: string): Promise<void> {
    await this.token(name).click();
  }
}
