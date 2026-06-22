import { BaseComponent } from '../base.component';

export class ThemeToggleComponent extends BaseComponent {
  readonly switchToDarkButton = this.page.getByRole('button', { name: /switch to dark theme/i });
  readonly switchToLightButton = this.page.getByRole('button', { name: /switch to light theme/i });

  async switchToDark(): Promise<void> {
    await this.switchToDarkButton.click();
  }

  async switchToLight(): Promise<void> {
    await this.switchToLightButton.click();
  }
}
