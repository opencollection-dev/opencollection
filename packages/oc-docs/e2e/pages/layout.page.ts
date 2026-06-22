import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { ThemeToggleComponent } from '@components/layout/theme-toggle.component';

/**
 * The app layout — chrome present on every screen (mount root, document theme,
 * theme toggle). Used by app-level specs (load/smoke, theming) so they never reach
 * for raw selectors.
 */
export class LayoutPage extends BasePage {
  /** The React mount root — visible once the app has booted. */
  readonly root = this.page.locator('#root');

  /** The document element, which carries the active `data-theme`. */
  readonly html = this.page.locator('html');

  /** App-wide light/dark theme control. */
  readonly themeToggle = new ThemeToggleComponent(this.page);

  /** A top-level heading by accessible name (e.g. the collection name). */
  collectionHeading(name: string): Locator {
    return this.page.getByRole('heading', { name });
  }
}
