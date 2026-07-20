import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

// The HTTP method picker in the playground QueryBar. A single-select MenuDropdown
// rendered as a listbox; visible the moment a request opens (no tab switch needed).
export class MethodSelectComponent extends BaseComponent {
  readonly trigger = this.page.getByTestId('method-select');
  readonly surface = this.page.getByTestId('method-select-dropdown');
  readonly activeOption = this.surface.locator('[role="option"][aria-selected="true"]');
  readonly focusedOption = this.surface.locator('.dropdown-item-focused');
  readonly options = this.surface.getByRole('option');

  option(id: string): Locator {
    return this.page.getByTestId(`method-select-${id.toLowerCase()}`);
  }

  async optionLabels(): Promise<string[]> {
    await this.open();
    await this.options.first().waitFor({ state: 'visible' });
    // Read aria-label, not text: the selected option renders a "✓" glyph that
    // would otherwise leak into the label.
    return this.options.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-label') ?? ''));
  }

  async open(): Promise<void> {
    await this.trigger.click();
  }

  async openWithKeyboard(key: 'Enter' | ' '): Promise<void> {
    await this.trigger.focus();
    await this.trigger.press(key);
  }
}
