import { BaseComponent } from '../base.component';

export class ThemeToggleComponent extends BaseComponent {
  readonly button = this.page.getByTestId('theme-toggle');

  async toggle(): Promise<void> {
    await this.button.click();
  }
}
