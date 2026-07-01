import type { Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

export class SidebarComponent extends BaseComponent {
  readonly items = this.page.getByTestId('sidebar-item');
  readonly inline = this.page.getByTestId('app-sidebar');
  readonly overview = this.page.getByTestId('sidebar-overview');
  readonly environments = this.page.getByTestId('sidebar-environments');
  readonly footer = this.page.getByTestId('sidebar-footer');
  readonly collapseButton = this.page.getByTestId('sidebar-collapse');
  readonly expandButton = this.page.getByTestId('sidebar-expand');
  readonly drawer = this.page.getByTestId('sidebar-drawer');
  readonly backdrop = this.page.getByTestId('sidebar-backdrop');
  readonly hamburger = this.page.getByTestId('topbar-menu');

  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async open(paths: string[]): Promise<void> {
    for (const name of paths) {
      await this.item(name).first().click();
    }
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
