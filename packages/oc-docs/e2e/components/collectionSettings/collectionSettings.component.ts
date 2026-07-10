import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class CollectionSettingsComponent extends BaseComponent {
  readonly view = this.page.getByTestId('playground-view');
  readonly collectionNode = this.page.getByTestId('sidebar-collection-root');
  readonly overviewMarkdown = this.view.getByTestId('overview-markdown-documentation');
  readonly overviewEmpty = this.view.getByTestId('overview-empty');
  readonly bulkEditToggle = this.view.getByTestId('bulk-edit-toggle');
  readonly varsTable = this.view.getByTestId('key-value-table');
  readonly authMode = this.view.getByTestId('auth-mode-select');

  tab(id: string): Locator {
    return this.view.getByTestId(`collection-settings-tabs-tab-${id}`);
  }

  scriptTab(id: string): Locator {
    return this.view.getByTestId(`scripts-tabs-tab-${id}`);
  }

  authField(name: string): Locator {
    return this.view.getByTestId(`auth-${name}`);
  }

  async open(): Promise<void> {
    await this.collectionNode.getByRole('button', { name: /Bruno Testbench|Collection/ }).click();
  }

  async openTab(id: string): Promise<void> {
    await this.tab(id).click();
  }
}
