import { test, expect } from '../../playwright';

const openAt = (dock: string): string => `/#/?pg=1&dock=${dock}`;
const LIST_USERS_EXAMPLE = 'List Users';
const UNAUTHORIZED_EXAMPLE = 'Unauthorized';

test.describe('Playground - Examples', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(openAt('bottom'));
  });

  test('expanding a request in the sidebar reveals its examples', async ({ playground }) => {
    await expect(playground.exampleToggle('get users')).toBeVisible();
    await expect(playground.exampleRow(LIST_USERS_EXAMPLE)).toHaveCount(0);

    await playground.exampleToggle('get users').click();

    await expect(playground.exampleRow(LIST_USERS_EXAMPLE)).toBeVisible();
    await expect(playground.exampleRow(UNAUTHORIZED_EXAMPLE)).toBeVisible();
  });

  test('selecting an example shows a read-only example view with the expected status', async ({ page, playground }) => {
    await playground.exampleToggle('get users').click();
    await playground.exampleRow(LIST_USERS_EXAMPLE).click();

    const exampleView = page.getByTestId('example-view');
    await expect(exampleView).toBeVisible();
    await expect(exampleView).toContainText('200');
    await expect(exampleView).toContainText('OK');

    // Only the example row is highlighted, not its parent request row.
    await expect(playground.exampleRow(LIST_USERS_EXAMPLE)).toHaveClass(/active/);
    await expect(playground.treeItems.filter({ hasText: 'get users' })).not.toHaveClass(/active/);
    await expect(page.getByTestId('example-view-request')).toBeVisible();
    await expect(page.getByTestId('example-view-response')).toBeVisible();

    // Read-only: no editable form controls anywhere in the example view.
    await expect(exampleView.locator('input, textarea')).toHaveCount(0);
  });

  test('switching to another example updates the view to its own status and stays read-only', async ({
    page,
    playground,
  }) => {
    await playground.exampleToggle('get users').click();
    await playground.exampleRow(UNAUTHORIZED_EXAMPLE).click();

    const exampleView = page.getByTestId('example-view');
    await expect(exampleView).toContainText('401');
    await expect(exampleView).toContainText('Unauthorized');
    await expect(exampleView.locator('input, textarea')).toHaveCount(0);
  });
});
