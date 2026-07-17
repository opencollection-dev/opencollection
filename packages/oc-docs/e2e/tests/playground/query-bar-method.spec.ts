import { test, expect } from '../../playwright';

const DESKTOP = { width: 1280, height: 900 };

test.describe('playground query bar - custom HTTP method', () => {
  test.use({ viewport: DESKTOP });

  test.beforeEach(async ({ page, playground }) => {
    await page.goto('/#/?pg=1&dock=bottom');
    await expect(playground.runner).toBeVisible();
    await playground.openRequest('get users');
    await expect(playground.view).toContainText('get users');
  });

  test('Add custom reveals a focused custom method input', async ({ queryBar }) => {
    await expect(queryBar.methodLabel).toHaveText('GET');

    await queryBar.enterCustomMode();

    await expect(queryBar.methodCustomInput).toBeVisible();
    await expect(queryBar.methodCustomInput).toBeFocused();
    await expect(queryBar.methodSelect).toHaveCount(0);
  });

  test('typing a custom method commits it uppercased on Enter', async ({ queryBar }) => {
    await queryBar.enterCustomMode();
    await queryBar.methodCustomInput.type('purge');
    await expect(queryBar.methodCustomInput).toHaveValue('PURGE');

    await queryBar.methodCustomInput.press('Enter');

    await expect(queryBar.methodCustomInput).toHaveCount(0);
    await expect(queryBar.methodLabel).toHaveText('PURGE');
  });

  test('Escape cancels custom mode and restores the previous method', async ({ queryBar }) => {
    await queryBar.enterCustomMode();
    await queryBar.methodCustomInput.type('purge');

    await queryBar.methodCustomInput.press('Escape');

    await expect(queryBar.methodCustomInput).toHaveCount(0);
    await expect(queryBar.methodLabel).toHaveText('GET');
  });

  test('committing an empty method keeps the previous method', async ({ queryBar }) => {
    await queryBar.enterCustomMode();
    await queryBar.methodCustomInput.fill('   ');

    await queryBar.methodCustomInput.press('Enter');

    await expect(queryBar.methodCustomInput).toHaveCount(0);
    await expect(queryBar.methodLabel).toHaveText('GET');
  });

  test('picking a standard verb after a custom method switches back', async ({ queryBar }) => {
    await queryBar.enterCustomMode();
    await queryBar.methodCustomInput.type('purge');
    await queryBar.methodCustomInput.press('Enter');
    await expect(queryBar.methodLabel).toHaveText('PURGE');

    await queryBar.selectMethod('POST');

    await expect(queryBar.methodLabel).toHaveText('POST');
  });

  test('a custom method with internal whitespace commits as a single normalized token', async ({ queryBar }) => {
    await queryBar.enterCustomMode();
    await queryBar.methodCustomInput.type('pur ge');
    await expect(queryBar.methodCustomInput).toHaveValue('PUR GE');

    await queryBar.methodCustomInput.press('Enter');

    await expect(queryBar.methodCustomInput).toHaveCount(0);
    await expect(queryBar.methodLabel).toHaveText('PURGE');
  });

  test('a lowercase standard verb normalizes to the standard method', async ({ queryBar }) => {
    await queryBar.enterCustomMode();
    await queryBar.methodCustomInput.type('patch');
    await expect(queryBar.methodCustomInput).toHaveValue('PATCH');

    await queryBar.methodCustomInput.press('Enter');

    await expect(queryBar.methodLabel).toHaveText('PATCH');

    await queryBar.openMethodDropdown();
    await expect(queryBar.methodItem('PATCH')).toHaveAttribute('aria-current', 'true');
  });
});
