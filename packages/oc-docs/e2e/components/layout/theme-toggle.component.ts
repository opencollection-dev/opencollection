import { BaseComponent } from '../base.component';

/**
 * The light/dark theme control in the app layout. It's a single button whose label
 * reflects the theme it switches TO — "Switch to dark theme" in light mode and
 * "Switch to light theme" in dark mode — so its `aria-label` doubles as a readout
 * of the current theme.
 */
export class ThemeToggleComponent extends BaseComponent {
  /** The toggle button. */
  readonly button = this.page.getByTestId('theme-toggle');

  /** Switch from light to dark. */
  async switchToDark(): Promise<void> {
    await this.button.click();
  }

  /** Switch from dark to light. */
  async switchToLight(): Promise<void> {
    await this.button.click();
  }
}
