import { test, expect } from '@fixtures';

test('app loads and renders the collection', { tag: ['@smoke'] }, async ({ layoutPage }) => {
  await layoutPage.goto();
  await expect(layoutPage.root).toBeVisible();
  await expect(layoutPage.collectionHeading('Bruno Testbench').first()).toBeVisible();
});
