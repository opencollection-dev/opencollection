import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { CollectionDocsComponent } from '@components/collection/collection-docs.component';
import { EndpointSectionComponent } from '@components/collection/endpoint-section.component';

/**
 * The rendered collection page (the docs/playground view). Composes the
 * collection-level docs and exposes the per-endpoint sections, so specs read as
 * `collectionPage.endpoint('echo json').<...>` with no raw selectors.
 */
export class CollectionPage extends BasePage {
  /** The page content wrapper — also the readiness element awaited by `goto`. */
  readonly root = this.page.locator('.playground-content');

  /** Collection-level documentation rendered at the top. */
  readonly docs = new CollectionDocsComponent(this.page, this.page.locator('.collection-docs'));

  /** Every endpoint section on the page. */
  readonly endpoints = this.page.locator('.endpoint-section');

  /** The collection-name page header (an h1 within the page content). */
  heading(name: string): Locator {
    return this.root.getByRole('heading', { name, level: 1 });
  }

  /**
   * An endpoint section located by its h1 title. Matching on the heading role (not
   * substring text) avoids accidentally matching example-tab labels or body text in
   * other sections.
   */
  endpoint(name: string): EndpointSectionComponent {
    const sectionRoot = this.endpoints.filter({
      has: this.page.getByRole('heading', { name, level: 1, exact: true })
    });
    return new EndpointSectionComponent(this.page, sectionRoot);
  }
}
