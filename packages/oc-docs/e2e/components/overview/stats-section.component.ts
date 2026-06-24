import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class StatsSection extends BaseComponent {

  readonly cards = this.page.getByTestId('collection-stats-card');

  card(label: string): Locator {
    return this.cards.filter({ hasText: label });
  }

  valueFor(label: string): Locator {
    return this.card(label).getByTestId('collection-stats-card-value');
  }
}
