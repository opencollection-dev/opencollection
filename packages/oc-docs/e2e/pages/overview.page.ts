import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { MarkdownComponent } from '../components/markdown.component';
import { HeaderSection } from '../components/overview/header.component';
import { StatsSection } from '../components/overview/collection-stats.component';
import { EnvironmentsSection } from '../components/overview/environments.component';
import { ConfigurationSection } from '../components/overview/collection-configuration.component';
import { VariableCardComponent } from '../components/variable-card/variable-card.component';

export class OverviewPage extends BasePage {
  readonly root = this.page.getByTestId('overview');

  readonly header = new HeaderSection(this.page);
  readonly stats = new StatsSection(this.page);
  readonly environments = new EnvironmentsSection(this.page);
  readonly configuration = new ConfigurationSection(this.page);
  readonly docMarkdown = new MarkdownComponent(this.page, this.page.getByTestId('overview-markdown-documentation'));
  readonly variableCard = new VariableCardComponent(this.page, this.root);

  sectionLabel(name: string): Locator {
    return this.page.getByTestId('overview-section-label').filter({ hasText: name });
  }
}
