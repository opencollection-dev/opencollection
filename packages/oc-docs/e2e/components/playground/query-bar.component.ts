import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

/**
 * The playground request URL bar. The URL is a HighlightedInput whose real
 * <input> carries the test id; the {{variable}} autocomplete list is portaled
 * to <body> under its own test id, so both are located page-wide.
 */
export class QueryBarComponent extends BaseComponent {
  readonly url = this.page.getByTestId('query-bar-url');
  readonly copyButton = this.page.getByTestId('query-bar-copy-url');
  readonly autocomplete = this.page.getByTestId('variable-autocomplete');

  option(name: string): Locator {
    return this.autocomplete.getByRole('option', { name });
  }
}
