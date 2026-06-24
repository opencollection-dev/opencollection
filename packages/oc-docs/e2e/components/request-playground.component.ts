import type { Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * The try-it request playground: open it from an endpoint, send the request,
 * edit the URL, and read the failure banner. A page-wide component (the
 * playground opens over the current screen), handed to tests as `requestPlayground`.
 *
 * Elements are found by test id or accessible name, never by class.
 */
export class RequestPlaygroundComponent extends BaseComponent {
  readonly sendButton = this.page.getByRole('button', { name: 'SEND' });
  readonly urlInput = this.page.getByPlaceholder('Enter request URL');
  readonly responseTab = this.page.getByRole('button', { name: 'Response', exact: true });

  // Failure banner (BRU-3408)
  readonly errorTitle = this.page.getByTestId('error-title');
  readonly errorMessage = this.page.getByTestId('error-message');

  /** An endpoint section, located by its h1 title. */
  section(name: string): Locator {
    return this.page.getByTestId('endpoint-section').filter({
      has: this.page.getByRole('heading', { name, level: 1, exact: true })
    });
  }

  /** Open the try-it playground for an endpoint via its "Try" button. */
  async open(endpoint: string): Promise<void> {
    await this.section(endpoint).getByRole('button', { name: 'Try' }).click();
  }

  async setUrl(url: string): Promise<void> {
    await this.urlInput.fill(url);
  }

  async send(): Promise<void> {
    await this.sendButton.click();
  }
}
