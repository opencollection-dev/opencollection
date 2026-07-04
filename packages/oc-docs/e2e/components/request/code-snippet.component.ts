import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class CodeSnippetComponent extends BaseComponent {
  readonly root = this.page.getByTestId('request-code-snippet');

  readonly code = this.root.getByTestId('code-snippet-code');

  readonly expandButton = this.root.getByTestId('code-snippet-expand');

  readonly modal = this.page.getByTestId('code-snippet-modal');

  readonly modalCode = this.modal.getByTestId('code-snippet-code');

  languageTab(language: string): Locator {
    return this.root.getByTestId(`code-snippet-tab-${language}`);
  }

  modalLanguageTab(language: string): Locator {
    return this.modal.getByTestId(`code-snippet-tab-${language}`);
  }

  async selectLanguage(language: string): Promise<void> {
    await this.languageTab(language).click();
  }

  /** Open the enlarged code-snippet view via the expand control. */
  async openExpandedView(): Promise<void> {
    await this.expandButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async selectModalLanguage(language: string): Promise<void> {
    await this.modalLanguageTab(language).click();
  }
}
