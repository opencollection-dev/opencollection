import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base.component';

export class ExamplesComponent extends BaseComponent {
  readonly root = this.page.getByTestId('request-examples');

  readonly items = this.root.getByTestId('example-card');

  example(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  statusCode(name: string): Locator {
    return this.example(name).getByTestId('example-status');
  }

  requestBody(name: string): Locator {
    return this.example(name).getByTestId('example-request-pane-body');
  }

  responseBody(name: string): Locator {
    return this.example(name).getByTestId('example-response-pane-body');
  }

  async open(name: string): Promise<void> {
    await this.example(name).getByTestId('example-toggle').click();
  }

  async selectRequestTab(name: string, tab: string): Promise<void> {
    await this.example(name).getByTestId(`example-request-pane-tab-${tab}`).click();
  }

  async selectResponseTab(name: string, tab: string): Promise<void> {
    await this.example(name).getByTestId(`example-response-pane-tab-${tab}`).click();
  }
}
