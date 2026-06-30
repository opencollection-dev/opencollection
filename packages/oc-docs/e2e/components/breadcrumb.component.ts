import type { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class BreadcrumbComponent extends BaseComponent {
  readonly current: Locator;
  readonly segments: Locator;

  constructor(page: Page, testId: string) {
    super(page, page.getByTestId(testId));

    this.current = page.getByTestId(`${testId}-current`);
    this.segments = page.getByTestId(`${testId}-segment`);
  }

  segment(name: string): Locator {
    return this.segments.filter({ hasText: name });
  }
}
