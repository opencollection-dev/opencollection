import type { Locator, Page } from '@playwright/test';

// Shared example-row/toggle selectors used by both the docs sidebar and the
// playground sidebar components. Each component supplies its own base locator
// (request row) and scope (page or sidebar panel).

export const exampleToggleFor = (requestRow: Locator): Locator =>
  requestRow.getByTestId('sidebar-example-toggle');

export const exampleRowFor = (scope: Page | Locator, exampleName: string): Locator =>
  scope.getByTestId('sidebar-example').filter({ hasText: exampleName });
