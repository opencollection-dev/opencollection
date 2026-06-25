import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class ExamplesComponent extends BaseComponent {
  readonly root = this.page.getByTestId('request-examples');

  readonly cards = this.root.getByTestId('example-card');

  card(name: string): Locator {
    return this.cards.filter({ hasText: name });
  }

  status(name: string): Locator {
    return this.card(name).getByTestId('example-status');
  }
}
