import { BaseComponent } from '../base.component';

/**
 * The light/dark theme control in the app layout. The button is labelled by the
 * theme it switches TO, so light mode shows "Switch to dark theme" and vice-versa.
 */
export class ThemeToggleComponent extends BaseComponent {
  readonly switchToDarkButton = this.page.getByRole('button', { name: /switch to dark theme/i });
  readonly switchToLightButton = this.page.getByRole('button', { name: /switch to light theme/i });

  /** Switch from light to dark. */
  async switchToDark(): Promise<void> {
    await this.switchToDarkButton.click();
  }

  /** Switch from dark to light. */
  async switchToLight(): Promise<void> {
    await this.switchToLightButton.click();
  }
}
