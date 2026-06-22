import { test, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '@components/overview/header.component';
import { StatsComponent } from '@components/overview/stats.component';
import { EnvironmentSummaryComponent } from '@components/overview/environment-summary.component';
import { DocsComponent } from '@components/overview/docs.component';
import { CollectionConfigurationComponent } from '@components/overview/collection-configuration.component';

/**
 * Page object for the collection Overview (the docs app root). Owns page-level
 * actions (navigation, readiness) and composes the section component objects, so
 * specs read as `overviewPage.<section>.<element>` with no raw selectors.
 */
export class OverviewPage extends BasePage {
  /** The Overview page root. */
  readonly root = this.page.getByTestId('overview');

  readonly header = new HeaderComponent(this.page);
  readonly stats = new StatsComponent(this.page);
  readonly environments = new EnvironmentSummaryComponent(this.page);
  readonly docs = new DocsComponent(this.page);
  readonly configuration = new CollectionConfigurationComponent(this.page);

  /** Dashed empty-state placeholders shown when a whole section has no data. */
  readonly emptyStateHeadings = this.root.getByTestId('overview-empty-heading');

  /** An uppercase section heading (e.g. "Environments", "Collection Configuration"). */
  sectionLabel(name: string): Locator {
    return this.page.getByTestId('overview-section-label').filter({ hasText: name });
  }

  /** Open the docs app and wait for the Overview to finish rendering. */
  async goto(): Promise<void> {
    await test.step('Open the docs and wait for the Overview to render', async () => {
      await this.navigate();
      await this.root.waitFor({ state: 'visible' });
    });
  }
}
