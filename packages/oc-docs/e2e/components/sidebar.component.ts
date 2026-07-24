import type { Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

export class SidebarComponent extends BaseComponent {
  readonly items = this.page.getByTestId('sidebar-item');
  readonly inline = this.page.getByTestId('app-sidebar');
  readonly overview = this.page.getByTestId('sidebar-overview');
  readonly environments = this.page.getByTestId('sidebar-environments');
  readonly collapseButton = this.page.getByTestId('sidebar-collapse');
  readonly expandButton = this.page.getByTestId('sidebar-expand');
  readonly resizer = this.page.getByTestId('sidebar-resizer');
  readonly drawer = this.page.getByTestId('sidebar-drawer');
  readonly backdrop = this.page.getByTestId('sidebar-backdrop');
  readonly hamburger = this.page.getByTestId('topbar-menu');

  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  folderChevron(name: string): Locator {
    return this.item(name).first().locator('.navlink-chevron');
  }

  async toggleFolder(name: string): Promise<void> {
    await this.folderChevron(name).click();
  }

  exampleToggle(requestName: string): Locator {
    return this.item(requestName).first().getByTestId('sidebar-example-toggle');
  }

  exampleRow(exampleName: string): Locator {
    return this.page.getByTestId('sidebar-example').filter({ hasText: exampleName });
  }

  async toggleExamples(requestName: string): Promise<void> {
    await this.exampleToggle(requestName).click();
  }

  async open(paths: string[]): Promise<void> {
    for (const name of paths) {
      await this.item(name).first().click();
    }
  }

  async width(): Promise<number> {
    const box = await this.inline.boundingBox();
    return box?.width ?? 0;
  }

  async grabResizer(): Promise<void> {
    await this.grabHandle(this.resizer);
  }

  async collapse(): Promise<void> {
    await this.inline.hover();
    await this.collapseButton.click();
  }

  async expand(): Promise<void> {
    await this.expandButton.click();
  }

  async openDrawer(): Promise<void> {
    await this.hamburger.click();
  }

  async closeDrawerViaBackdrop(): Promise<void> {
    await this.backdrop.click({ position: { x: 375, y: 400 } });
  }
}
