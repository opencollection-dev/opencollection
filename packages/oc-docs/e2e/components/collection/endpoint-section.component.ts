import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { ExamplesComponent } from './examples.component';

export class EndpointSectionComponent extends BaseComponent {
  readonly methodBadge = this.root.locator('.badge-method');
  readonly url = this.root.locator('.badge-url');
  readonly requestBody = this.root.locator('.request-body-section');
  readonly requestBodyTitle = this.requestBody.locator('.section-title');
  readonly itemDocs = this.root.locator('.item-docs');
  readonly codeSnippets = this.root.locator('.code-snippets-wrapper');
  readonly examples = new ExamplesComponent(this.page, this.root.locator('.examples-container'));

  table(name: string): Locator {
    return this.root.locator('.minimal-table').filter({ hasText: name });
  }

  get headersTable(): Locator {
    return this.table('Headers');
  }

  get queryParamsTable(): Locator {
    return this.table('Query Parameters');
  }
}
