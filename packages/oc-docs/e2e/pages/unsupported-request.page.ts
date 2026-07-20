import { BasePage } from './base.page';
import { SidebarComponent } from '../components/sidebar.component';
import { BreadcrumbComponent } from '../components/breadcrumb.component';
import { RequestUrlBarComponent } from '../components/request/url-bar.component';

export class UnsupportedRequestPage extends BasePage {
  readonly sidebar = new SidebarComponent(this.page);
  readonly breadcrumb = new BreadcrumbComponent(this.page, 'unsupported-request-breadcrumb');
  readonly urlBar = new RequestUrlBarComponent(this.page);

  readonly root = this.page.getByTestId('unsupported-request');
  readonly title = this.page.getByTestId('unsupported-request-title');
  readonly message = this.page.getByTestId('unsupported-request-empty');
  readonly docs = this.root.getByTestId('overview-markdown-documentation');

  async open(path: string[]): Promise<void> {
    await this.navigate('/');
    await this.sidebar.open(path);
    await this.root.waitFor({ state: 'visible' });
  }
}
