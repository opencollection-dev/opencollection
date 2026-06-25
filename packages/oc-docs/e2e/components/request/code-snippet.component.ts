import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class CodeSnippetComponent extends BaseComponent {
  readonly root = this.page.getByTestId('request-code-snippet');

  readonly code = this.root.locator('code');

  tab(language: string): Locator {
    return this.root.getByTestId(`code-snippet-tab-${language}`);
  }

  async selectLanguage(language: string): Promise<void> {
    await this.tab(language).click();
  }
}
