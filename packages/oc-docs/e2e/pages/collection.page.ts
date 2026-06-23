import { BasePage } from './base.page';
import { MarkdownComponent } from '../components/markdown.component';

export class CollectionPage extends BasePage {
  readonly markdownRoot = this.page.getByTestId('collection-docs-markdown');

  readonly overview = new MarkdownComponent(this.page, this.markdownRoot);
}
