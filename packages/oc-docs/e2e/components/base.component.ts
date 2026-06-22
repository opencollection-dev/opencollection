import type { Page, Locator } from '@playwright/test';

/**
 * Base class for component objects — reusable, self-contained slices of a page
 * (a header, a list, an endpoint card). A page object composes these instead of
 * owning every locator itself, which keeps each class small and focused.
 *
 * A component is scoped to a `root` locator — the container it lives in — so the
 * same component can be reused for each repeated instance on a page (e.g. one per
 * endpoint section). Page-wide components can omit `root`; it then defaults to the
 * whole document.
 *
 * Subclasses declare fixed locators as `readonly` fields (Playwright evaluates them
 * lazily, so there's no cost to declaring them up front) and expose parameterized
 * locators as methods.
 */
export abstract class BaseComponent {
  /** The element this component is scoped to. */
  readonly root: Locator;

  constructor(protected readonly page: Page, root?: Locator) {
    this.root = root ?? page.locator(':root');
  }
}
