import type { Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { BaseComponent } from '../components/base.component';
import { MarkdownComponent } from '../components/markdown.component';
import { CopyButtonComponent } from '../components/copy-button.component';
import { SecretValueComponent } from '../components/secret-value.component';

/** The Overview headline: the collection's version label and its name. */
class HeaderSection extends BaseComponent {
  readonly collectionVersion = this.page.getByTestId('overview-collection-version');
  readonly collectionName = this.page.getByTestId('overview-collection-name');
}

/** The stat counter cards (Requests / Folders / Environments). */
class StatsSection extends BaseComponent {
  /** Every stat counter card. */
  readonly cards = this.page.getByTestId('overview-stat-card');

  /** The stat card for a given label (e.g. "Requests"). */
  card(label: string): Locator {
    return this.cards.filter({ hasText: label });
  }

  /** The numeric value shown on a stat card (e.g. the "10" on the Requests card). */
  valueFor(label: string): Locator {
    return this.card(label).getByTestId('overview-stat-card-value');
  }
}

/** The list of environments shown on the Overview. */
class EnvironmentsSection extends BaseComponent {
  /** Every environment row in the list. */
  readonly items = this.page.getByTestId('overview-environment-item');

  /** The row for a named environment (e.g. "Local"). */
  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  /** The variable-count label within a named environment's row (e.g. "2 variables"). */
  variableCount(name: string): Locator {
    return this.item(name).getByTestId('overview-environment-item-variable-count');
  }
}

/** The Collection Configuration panel: headers, auth, script and tests groups. */
class ConfigurationSection extends BaseComponent {
  readonly root = this.page.getByTestId('overview-configuration');

  readonly copyButton = new CopyButtonComponent(this.page, this.root.getByTestId('overview-configuration-copy').first());

  readonly secret = new SecretValueComponent(this.page, 'overview-configuration-secret');

  subHeading(name: string): Locator {
    return this.root.getByTestId('overview-configuration-subheading').filter({ hasText: name });
  }

  row(key: string): Locator {
    return this.root.getByTestId('overview-configuration-row').filter({ hasText: key });
  }

  rowValue(key: string): Locator {
    return this.row(key).getByTestId('overview-configuration-row-value');
  }
}

export class OverviewPage extends BasePage {
  readonly root = this.page.getByTestId('overview');

  readonly header = new HeaderSection(this.page);
  readonly stats = new StatsSection(this.page);
  readonly environments = new EnvironmentsSection(this.page);
  readonly configuration = new ConfigurationSection(this.page);
  readonly markdown = new MarkdownComponent(this.page, this.page.getByTestId('overview-markdown-documentation'));

  /** An uppercase section label (e.g. "Environments", "Collection Configuration"). */
  sectionLabel(name: string): Locator {
    return this.page.getByTestId('overview-section-label').filter({ hasText: name });
  }
}
