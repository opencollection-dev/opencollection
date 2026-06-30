import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { MarkdownComponent } from '../components/markdown.component';
import { HeaderSection } from '../components/overview/header.component';
import { StatsSection } from '../components/overview/collection-stats.component';
import { EnvironmentsSection } from '../components/overview/environments.component';
import { CollectionConfigurationComponent } from '../components/overview/collection-configuration.component';

export class OverviewPage extends BasePage {
  readonly root = this.page.getByTestId('overview');

  readonly header = new HeaderSection(this.page);
  readonly stats = new StatsSection(this.page);
  readonly environments = new EnvironmentsSection(this.page);
  readonly configuration = new CollectionConfigurationComponent(this.page);
  readonly docMarkdown = new MarkdownComponent(this.page, this.page.getByTestId('overview-markdown-documentation'));

  sectionLabel(name: string): Locator {
    return this.page.getByTestId('overview-section-label').filter({ hasText: name });
  }
}
