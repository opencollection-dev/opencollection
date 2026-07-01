import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SidebarComponent } from '../components/sidebar.component';
import { EnvironmentTableComponent } from '../components/environments/environment-table.component';

export class EnvironmentsPage extends BasePage {

  readonly root = this.page.getByTestId('environments-page');
  readonly title = this.page.getByTestId('environments-title');
  readonly tabs = this.page.getByTestId('environment-tab');
  readonly variablesGroup = this.page.getByTestId('environment-variables');
  readonly secretVariablesGroup = this.page.getByTestId('environment-secret-variables');
  readonly externalSecretsGroup = this.page.getByTestId('environment-external-secrets');
  readonly emptyState = this.page.getByTestId('environments-empty');

  readonly table = new EnvironmentTableComponent(this.page);
  readonly sidebar = new SidebarComponent(this.page);

  async open(): Promise<void> {
    await this.navigate('/');
    await this.page.getByTestId('sidebar-environments').click();
    await this.root.waitFor({ state: 'visible' });
  }

  tab(name: string): Locator {
    return this.tabs.filter({ hasText: name });
  }
}
