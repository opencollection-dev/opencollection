import type { Locator } from '@playwright/test';
import { BaseComponent } from './base.component';
import { KeyValueTableComponent } from './key-value-table/key-value-table.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import type { DockMode } from '../../src/utils/playgroundDock';

export class PlaygroundComponent extends BaseComponent {
  readonly keyValueTable = new KeyValueTableComponent(this.page);
  readonly preRequestScriptEditor = new CodeEditorComponent(this.page, 'scripts-editor-pre-request');
  readonly postResponseScriptEditor = new CodeEditorComponent(this.page, 'scripts-editor-post-response');

  readonly header = this.page.getByTestId('playground-header');
  readonly switcher = this.page.getByTestId('playground-dock-switcher');
  readonly content = this.page.getByTestId('playground-content');
  readonly runner = this.page.getByTestId('playground-runner');
  readonly loadError = this.page.getByTestId('playground-load-error');
  readonly sidebarPanel = this.page.getByTestId('playground-sidebar-panel');
  readonly collectionNode = this.page.getByTestId('sidebar-collection-root');
  readonly envSwitcher = this.page.getByTestId('playground-env-switcher');
  readonly gear = this.page.getByTestId('playground-env-settings');
  readonly view = this.page.getByTestId('playground-view');
  readonly sidebarToggle = this.page.getByTestId('playground-sidebar-toggle');
  readonly treeItems = this.page.getByTestId('playground-sidebar-panel').getByTestId('sidebar-item');
  readonly closeButton = this.page.getByTestId('playground-close');
  readonly collapseButton = this.page.getByTestId('playground-collapse');
  readonly inlinePanel = this.page.getByTestId('playground-dock-inline-panel');
  readonly bottomPanel = this.page.getByTestId('playground-dock-bottom-panel');
  readonly modalPanel = this.page.getByTestId('playground-dock-modal-panel');
  readonly methodSelect = this.view.getByTestId('query-bar-method-select');
  readonly unsupported = this.view.getByTestId('unsupported-request');
  readonly unsupportedTitle = this.view.getByTestId('unsupported-request-title');
  readonly unsupportedMessage = this.view.getByTestId('unsupported-request-empty');
  readonly unsupportedIcon = this.view.getByTestId('file-not-found-icon');

  /** Navigate to the playground with the given dock mode. */
  async open(dock: DockMode = 'bottom'): Promise<void> {
    await this.page.goto(`/#/?pg=1&dock=${dock}`);
  }

  sidebarItem(name: string): Locator {
    return this.treeItems.filter({ hasText: name }).first();
  }

  async openSidebarItem(name: string): Promise<void> {
    await this.sidebarItem(name).click();
  }

  scriptTab(id: string): Locator {
    return this.page.getByTestId(`scripts-tabs-tab-${id}`);
  }

  async selectScriptTab(id: string): Promise<void> {
    await this.scriptTab(id).click();
  }

  /** The option labels offered by the query-bar method dropdown. */
  async methodOptions(): Promise<string[]> {
    return this.methodSelect.locator('option').allInnerTexts();
  }

  /** Open a request in the playground: expand intermediate folders, click the leaf. */
  async openTreeItem(names: string[]): Promise<void> {
    for (let i = 0; i < names.length; i++) {
      const item = this.treeItems.filter({ hasText: names[i] }).first();
      if (i < names.length - 1) {
        await item.getByTestId('sidebar-item-chevron').click();
      } else {
        await item.click();
      }
    }
  }

  dockButton(mode: DockMode): Locator {
    return this.page.getByTestId(`playground-dock-${mode}`);
  }

  panel(mode: DockMode): Locator {
    return this.page.getByTestId(`playground-dock-${mode}-panel`);
  }

  async selectDock(mode: DockMode): Promise<void> {
    await this.dockButton(mode).click();
  }

  tab(id: string): Locator {
    return this.page.getByTestId(`tabs-tab-${id}`);
  }

  async selectTab(id: string): Promise<void> {
    await this.tab(id).click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async toggleCollapse(): Promise<void> {
    await this.collapseButton.click();
  }
}
