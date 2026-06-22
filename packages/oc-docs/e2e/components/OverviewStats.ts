import type { Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/** Stat counters on the Overview (Requests / Folders / Environments). */
export class OverviewStats extends BaseComponent {
  /** Every stat counter. */
  readonly all = this.page.getByTestId('overview-stat');

  /** The counter card for a given label (e.g. "Requests"). */
  item(label: string): Locator {
    return this.all.filter({ hasText: label });
  }

  /** The numeric value within a counter (e.g. the "10" in Requests). */
  value(label: string): Locator {
    return this.item(label).getByTestId('overview-stat-value');
  }
}
