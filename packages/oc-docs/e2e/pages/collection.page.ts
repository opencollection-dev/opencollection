import { BasePage } from './base.page';
import { MarkdownComponent } from '../components/markdown.component';

export class CollectionPage extends BasePage {
  // The overview block; `goto()` waits on it as the "content has rendered" signal.
  readonly root = this.page.getByTestId('collection-docs');

  /** The collection's overview, rendered from Markdown. */
  readonly overview = new MarkdownComponent(this.page, this.root);
}
