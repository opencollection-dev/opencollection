import type { Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * The rendered-markdown documentation section. Its body is generated HTML with no
 * test ids, so internals are matched by role/tag/text relative to the container.
 */
export class OverviewDocs extends BaseComponent {
  /** The documentation container. */
  readonly content = this.page.getByTestId('overview-docs');

  /** The (single) rendered markdown table. */
  readonly table = this.content.getByRole('table');

  /** A rendered markdown heading by its accessible name. */
  heading(name: string): Locator {
    return this.content.getByRole('heading', { name });
  }
}
