import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

/** The Environments list shown on the Overview. */
export class EnvironmentSummaryComponent extends BaseComponent {
  /** The list container. */
  readonly list = this.page.getByTestId('overview-environments');

  /** Every environment row. */
  readonly items = this.page.getByTestId('overview-environment');

  /** The row for a named environment (e.g. "Local"). */
  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  /** The variable-count label within a named environment's row. */
  variableCount(name: string): Locator {
    return this.item(name).getByTestId('overview-environment-vars');
  }
}
