import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { MarkdownComponent } from '../components/markdown.component';
import { HeaderSection } from '../components/overview/header-section.component';
import { StatsSection } from '../components/overview/stats-section.component';
import { EnvironmentsSection } from '../components/overview/environments-section.component';
import { ConfigurationSection } from '../components/overview/configuration-section.component';

export class OverviewPage extends BasePage {
  readonly root = this.page.getByTestId('overview');

  readonly header = new HeaderSection(this.page);
  readonly stats = new StatsSection(this.page);
  readonly environments = new EnvironmentsSection(this.page);
  readonly configuration = new ConfigurationSection(this.page);
  readonly docMarkdown = new MarkdownComponent(this.page, this.page.getByTestId('overview-markdown-documentation'));

  /** An uppercase section label (e.g. "Environments", "Collection Configuration"). */
  sectionLabel(name: string): Locator {
    return this.page.getByTestId('overview-section-label').filter({ hasText: name });
  }
}
