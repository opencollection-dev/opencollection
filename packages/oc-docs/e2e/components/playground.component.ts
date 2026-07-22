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
  readonly sidebarResizer = this.page.getByTestId('playground-sidebar-resizer');
  readonly sidebarBackdrop = this.page.getByTestId('playground-sidebar-backdrop');
  readonly collectionNode = this.page.getByTestId('sidebar-collection-root');
  readonly collectionCollapseToggle = this.collectionNode.getByRole('button', {
    name: /Collapse collection|Expand collection/,
  });
  readonly collectionRootLink = this.collectionNode.getByRole('button', {
    name: /Bruno Testbench|Collection/,
  });
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
  readonly mobilePanel = this.page.getByTestId('playground-dock-mobile-panel');
  readonly unsupported = this.view.getByTestId('unsupported-request');
  readonly unsupportedTitle = this.view.getByTestId('unsupported-request-title');
  readonly unsupportedMessage = this.view.getByTestId('unsupported-request-empty');
  readonly unsupportedIcon = this.view.getByTestId('file-not-found-icon');
  readonly exampleView = this.page.getByTestId('example-view');
  readonly exampleViewRequest = this.page.getByTestId('example-view-request');
  readonly exampleViewResponse = this.page.getByTestId('example-view-response');

  readonly exampleViewControls = this.exampleView.locator('input, textarea');

  exampleToggle(requestName: string): Locator {
    return this.treeItems.filter({ hasText: requestName }).getByTestId('sidebar-example-toggle');
  }

  exampleRow(exampleName: string): Locator {
    return this.sidebarPanel.getByTestId('sidebar-example').filter({ hasText: exampleName });
  }

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

  async openTreeItem(names: string[]): Promise<void> {
    for (const name of names) {
      await this.treeItems.filter({ hasText: name }).first().click();
    }
  }

  dockButton(mode: DockMode): Locator {
    return this.page.getByTestId(`playground-dock-${mode}`);
  }

  panel(mode: DockMode): Locator {
    return this.page.getByTestId(`playground-dock-${mode}-panel`);
  }

  async open(mode: DockMode): Promise<void> {
    await this.page.goto(`/#/?pg=1&dock=${mode}`);
    await this.runner.waitFor({ state: 'visible' });
  }

  async openRequest(name: string): Promise<void> {
    await this.treeItems.filter({ hasText: name }).first().click();
  }

  async openEnvironments(): Promise<void> {
    if (!(await this.gear.isVisible())) {
      await this.sidebarToggle.click();
    }
    await this.gear.click();
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

  async sidebarWidth(): Promise<number> {
    const box = await this.sidebarPanel.boundingBox();
    return box?.width ?? 0;
  }

  async grabSidebarResizer(): Promise<void> {
    await this.grabHandle(this.sidebarResizer);
  }
}
