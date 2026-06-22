import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ThemeToggleComponent } from '@components/layout/theme-toggle.component';

export class LayoutPage extends BasePage {
  // `root` (#root) and `html` are inherited from BasePage.
  readonly themeToggle = new ThemeToggleComponent(this.page);

  collectionHeading(name: string): Locator {
    return this.page.getByRole('heading', { name });
  }
}
