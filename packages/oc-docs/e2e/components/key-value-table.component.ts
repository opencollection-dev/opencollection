import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

/** A KeyValueTable instance (headers, params, variables …). Pass the table's testId to target a specific one. */
export class KeyValueTableComponent extends BaseComponent {
  readonly container: Locator;
  readonly table: Locator;
  readonly nameInputs: Locator;
  readonly valueInputs: Locator;
  readonly cellErrors: Locator;
  readonly autocomplete: Locator;

  constructor(page: Page, testId = 'key-value-table') {
    super(page, page.getByTestId(testId));
    this.container = page.getByTestId(`${testId}-container`);
    this.table = page.getByTestId(`${testId}-table`);
    this.nameInputs = page.getByTestId(`${testId}-name-input`);
    this.valueInputs = page.getByTestId(`${testId}-value-input`);
    this.cellErrors = page.getByTestId(`${testId}-error`);
    this.autocomplete = page.getByTestId('variable-autocomplete');
  }
}
