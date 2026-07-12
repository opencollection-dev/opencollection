import type { Locator } from '@playwright/test';
import { BaseComponent } from './base.component';
import type { DockMode } from '../../src/utils/playgroundDock';

export class PlaygroundComponent extends BaseComponent {
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

  exampleToggle(requestName: string): Locator {
    return this.treeItems.filter({ hasText: requestName }).getByTestId('sidebar-example-toggle');
  }

  exampleRow(exampleName: string): Locator {
    return this.sidebarPanel.getByTestId('sidebar-example').filter({ hasText: exampleName });
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

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async toggleCollapse(): Promise<void> {
    await this.collapseButton.click();
  }
}
