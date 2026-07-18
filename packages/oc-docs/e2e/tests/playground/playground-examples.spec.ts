import { test, expect } from '../../playwright';

const openAt = (dock: string): string => `/#/?pg=1&dock=${dock}`;
const LIST_USERS_EXAMPLE = 'List Users';
const LIST_USERS_SLUG = 'list-users';
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

  test('selecting an example shows a read-only example view with the expected status', async ({ playground }) => {
    await playground.exampleToggle('get users').click();
    await playground.exampleRow(LIST_USERS_EXAMPLE).click();

    const exampleView = playground.exampleView;
    await expect(exampleView).toBeVisible();
    await expect(exampleView).toContainText('200');
    await expect(exampleView).toContainText('OK');

    // Only the example row is highlighted, not its parent request row.
    await expect(playground.exampleRow(LIST_USERS_EXAMPLE)).toHaveClass(/active/);
    await expect(playground.treeItems.filter({ hasText: 'get users' })).not.toHaveClass(/active/);
    await expect(playground.exampleViewRequest).toBeVisible();
    await expect(playground.exampleViewResponse).toBeVisible();

    // Read-only: no editable form controls anywhere in the example view.
    await expect(playground.exampleViewControls).toHaveCount(0);
  });

  test('switching to another example updates the view to its own status and stays read-only', async ({ playground }) => {
    await playground.exampleToggle('get users').click();
    await playground.exampleRow(UNAUTHORIZED_EXAMPLE).click();

    const exampleView = playground.exampleView;
    await expect(exampleView).toContainText('401');
    await expect(exampleView).toContainText('Unauthorized');
    await expect(playground.exampleViewControls).toHaveCount(0);
  });

  test('deep-links the example: pgEx in the url, reload restores the example view', async ({ page, playground }) => {
    await playground.exampleToggle('get users').click();
    await playground.exampleRow(LIST_USERS_EXAMPLE).click();
    await expect(playground.exampleView).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`[?&]pgEx=${LIST_USERS_SLUG}(?:&|$)`));

    await page.reload();
    await expect(playground.exampleView).toBeVisible();
    await expect(playground.exampleView).toContainText('200');
  });

  test('browser back and forward move between examples in the playground', async ({ page, playground }) => {
    await playground.exampleToggle('get users').click();
    await playground.exampleRow(LIST_USERS_EXAMPLE).click();
    await expect(playground.exampleView).toContainText('200');
    await playground.exampleRow(UNAUTHORIZED_EXAMPLE).click();
    await expect(playground.exampleView).toContainText('401');

    await page.goBack();
    await expect(playground.exampleView).toContainText('200');
    await page.goForward();
    await expect(playground.exampleView).toContainText('401');
  });
});
