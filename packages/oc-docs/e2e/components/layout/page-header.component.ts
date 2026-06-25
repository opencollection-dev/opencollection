import type { Page } from '@playwright/test';
import { BaseComponent } from '../base.component';

/**
 * The page header (sticky top navigation bar). A layout component — present on
 * every screen — so tests get it handed over directly (`pageHeader.brandName`),
 * the same way the sidebar is.
 *
 * Scoped to the `topbar` test id. Exposes the header's own shipped chrome:
 * brand cluster, the Open-in-Bruno CTA, and the menu (hamburger) trigger.
 * Parts are found by test id or accessible name, never by class.
 */
export class PageHeaderComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.getByTestId('topbar'));
  }

  // Brand cluster
  readonly brand = this.root.getByTestId('brand');
  readonly brandName = this.root.getByTestId('brand-name');
  readonly brandVersion = this.root.getByTestId('brand-version');
  readonly brandInitials = this.root.getByTestId('brand-initials');

  // Open-in-Bruno CTA
  readonly openInBruno = this.root.getByTestId('open-in-bruno');

  // Sidebar (hamburger) trigger — shown below desktop. The header only renders
  // the button; the drawer it opens lives elsewhere.
  readonly menuButton = this.root.getByRole('button', { name: /toggle sidebar/i });
}
