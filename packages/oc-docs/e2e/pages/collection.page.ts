import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { CollectionDocsComponent } from '@components/collection/collection-docs.component';
import { EndpointSectionComponent } from '@components/collection/endpoint-section.component';

export class CollectionPage extends BasePage {
  readonly root = this.page.locator('.playground-content');

  readonly docs = new CollectionDocsComponent(this.page, this.page.locator('.collection-docs'));

  readonly endpoints = this.page.locator('.endpoint-section');

  heading(name: string): Locator {
    return this.root.getByRole('heading', { name, level: 1 });
  }

  endpoint(name: string): EndpointSectionComponent {
    const sectionRoot = this.endpoints.filter({
      has: this.page.getByRole('heading', { name, level: 1, exact: true })
    });
    return new EndpointSectionComponent(this.page, sectionRoot);
  }
}
