import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

/**
 * The playground request URL bar. The URL is a HighlightedInput whose real
 * <input> carries the test id; the {{variable}} autocomplete list is portaled
 * to <body> under its own test id, so both are located page-wide.
 *
 * The highlight mirror that paints the tokens is aria-hidden and its per-token
 * spans carry no test id (they are generated), so token validity is read from
 * the .variable-valid / .variable-invalid classes the component assigns - the
 * same classes the app hit-tests for hover. A valid token is resolvable (green);
 * an invalid one is not (red).
 */
export class QueryBarComponent extends BaseComponent {
  readonly url = this.page.getByTestId('query-bar-url');
  readonly copyButton = this.page.getByTestId('query-bar-copy-url');
  readonly autocomplete = this.page.getByTestId('variable-autocomplete');

  option(name: string): Locator {
    return this.autocomplete.getByRole('option', { name });
  }

  validToken(name: string): Locator {
    return this.page.locator('.highlight-input-mirror .variable-valid').filter({ hasText: `{{${name}}}` });
  }

  invalidToken(name: string): Locator {
    return this.page.locator('.highlight-input-mirror .variable-invalid').filter({ hasText: `{{${name}}}` });
  }
}
