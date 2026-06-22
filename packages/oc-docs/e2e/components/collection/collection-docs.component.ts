import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class CollectionDocsComponent extends BaseComponent {
  readonly table = this.root.locator('table');
  readonly blockquote = this.root.locator('blockquote');

  heading(name: string): Locator {
    return this.root.getByRole('heading', { name, level: 2 });
  }

  text(value: string): Locator {
    return this.root.getByText(value);
  }

  strong(value: string): Locator {
    return this.root.locator('strong', { hasText: value });
  }

  code(value: string): Locator {
    return this.root.locator('code', { hasText: value });
  }
}
