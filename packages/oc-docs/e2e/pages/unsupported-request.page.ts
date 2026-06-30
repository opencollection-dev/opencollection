import { BasePage } from './base.page';
import { SidebarComponent } from '../components/sidebar.component';
import { BreadcrumbComponent } from '../components/breadcrumb.component';

export class UnsupportedRequestPage extends BasePage {
  readonly root = this.page.getByTestId('unsupported-request');

  readonly sidebar = new SidebarComponent(this.page);
  readonly breadcrumb = new BreadcrumbComponent(this.page, 'unsupported-request-breadcrumb');
  readonly title = this.page.getByTestId('unsupported-request-title');
  readonly message = this.page.getByTestId('unsupported-request-empty');

  async open(path: string[]): Promise<void> {
    await this.navigate('/');
    await this.sidebar.open(path);
    await this.root.waitFor({ state: 'visible' });
  }
}
