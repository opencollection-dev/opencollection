import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

/**
 * Collection-level documentation rendered at the top of the page. Its body is
 * generated markdown HTML, so internals are matched by role/tag/text relative to
 * the `.collection-docs` container (`root`).
 */
export class CollectionDocsComponent extends BaseComponent {
  /** The (single) rendered markdown table. */
  readonly table = this.root.locator('table');
  /** The rendered blockquote. */
  readonly blockquote = this.root.locator('blockquote');

  /** A level-2 markdown heading by its accessible name. */
  heading(name: string): Locator {
    return this.root.getByRole('heading', { name, level: 2 });
  }

  /** Body text by substring (paragraphs, list items). */
  text(value: string): Locator {
    return this.root.getByText(value);
  }

  /** Bold (`<strong>`) text by substring. */
  strong(value: string): Locator {
    return this.root.locator('strong', { hasText: value });
  }

  /** Inline/blocked `<code>` by substring. */
  code(value: string): Locator {
    return this.root.locator('code', { hasText: value });
  }
}
