import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';
import { ExamplesComponent } from './examples.component';

/**
 * A single endpoint card on the collection page: method/URL badges, headers and
 * query-param tables, request body, item docs, code snippets and saved examples.
 */
export class EndpointSectionComponent extends BaseComponent {
  readonly methodBadge = this.root.locator('.badge-method');
  readonly url = this.root.locator('.badge-url');
  readonly requestBody = this.root.locator('.request-body-section');
  readonly requestBodyTitle = this.requestBody.locator('.section-title');
  readonly itemDocs = this.root.locator('.item-docs');
  readonly codeSnippets = this.root.locator('.code-snippets-wrapper');
  readonly examples = new ExamplesComponent(this.page, this.root.locator('.examples-container'));

  /** A `.minimal-table` block by its section text (e.g. "Headers", "Query Parameters"). */
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
