import { BasePage } from './base.page';
import { SidebarComponent } from '../components/sidebar.component';
import { BreadcrumbComponent } from '../components/breadcrumb.component';
import { ScriptContentComponent } from '../components/script/script-content.component';

export class ScriptPage extends BasePage {
  readonly root = this.page.getByTestId('script-page');

  readonly sidebar = new SidebarComponent(this.page);
  readonly breadcrumb = new BreadcrumbComponent(this.page, 'script-breadcrumb');
  readonly title = this.page.getByTestId('script-title');
  readonly content = new ScriptContentComponent(this.page);

  async open(path: string[]): Promise<void> {
    await this.navigate('/');
    await this.sidebar.open(path);
    await this.root.waitFor({ state: 'visible' });
  }
}
