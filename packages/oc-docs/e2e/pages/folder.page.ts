import { BasePage } from './base.page';
import { SidebarComponent } from '../components/sidebar.component';
import { BreadcrumbComponent } from '../components/breadcrumb.component';
import { FolderConfigurationComponent } from '../components/folder/folder-configuration.component';

export class FolderPage extends BasePage {
  readonly root = this.page.getByTestId('folder-page');
  readonly title = this.page.getByTestId('folder-title');
  readonly requestCount = this.page.getByTestId('folder-request-count');
  readonly folderMarkdownDocs = this.page.getByTestId('folder-docs');
  readonly folderMarkdownDocsToggle = this.page.getByTestId('folder-docs-toggle');
  readonly emptyState = this.page.getByTestId('folder-config-empty');

  readonly sidebar = new SidebarComponent(this.page);
  readonly breadcrumb = new BreadcrumbComponent(this.page, 'folder-breadcrumb');
  readonly configuration = new FolderConfigurationComponent(this.page);

  async open(trail: string[]): Promise<void> {
    await this.navigate('/');
    await this.sidebar.open(trail);
    await this.root.waitFor({ state: 'visible' });
  }
}
