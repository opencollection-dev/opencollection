import { test, expect } from '../../playwright';

test.describe('KeyValueTable — tooltips & mobile scroll', () => {
  test.beforeEach(async ({ page, playground }) => {
    await page.goto('/#/?pg=1&dock=bottom');
    await playground.treeItems.filter({ hasText: 'get users' }).first().click();
    await page.getByTestId('tabs-tab-headers').click();
    await expect(page.getByTestId('key-value-table')).toBeVisible();
  });

  test('a typed cell carries a native title tooltip with its full value', async ({ page }) => {
    const nameInput = page.getByTestId('key-value-table').locator('input.text-input').first();
    await nameInput.click();
    await page.keyboard.type('-A-Very-Long-Custom-Header-Name-That-Truncates');
    // The full value is exposed as a native title tooltip so a truncated cell stays readable.
    const value = await nameInput.inputValue();
    expect(value.length).toBeGreaterThan(0);
    await expect(nameInput).toHaveAttribute('title', value);
  });

  test('the table has a min-width and a horizontally-scrollable container', async ({ page }) => {
    const kvt = page.getByTestId('key-value-table');
    await expect(kvt.locator('.key-value-table-container')).toHaveCSS('overflow-x', 'auto');
    await expect(kvt.locator('table.key-value-table')).toHaveCSS('min-width', '448px'); // 28rem @16px

    // Narrow the viewport below the min-width → the container actually overflows and scrolls.
    await page.setViewportSize({ width: 360, height: 800 });
    const overflows = await kvt
      .locator('.key-value-table-container')
      .evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(overflows).toBe(true);
  });

  test('offers {{variable}} autocomplete in the value cell but not the name cell', async ({ page }) => {
    const kvt = page.getByTestId('key-value-table');
    const autocomplete = page.getByTestId('variable-autocomplete');

    // Value cell: a `{{` reference surfaces the collection's variables.
    await kvt.locator('.col-value input.text-input').last().click();
    await page.keyboard.type('{{coll');
    await expect(autocomplete).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(autocomplete).toHaveCount(0);

    // Name cell: the same reference must not open the dropdown — the app only
    // autocompletes variables in value cells, never in param/variable name cells.
    await kvt.locator('.col-key input.text-input').last().click();
    await page.keyboard.type('{{coll');
    await page.waitForTimeout(250);
    await expect(autocomplete).toHaveCount(0);
  });

  test('flags a header name that contains a space with an inline error', async ({ page }) => {
    const kvt = page.getByTestId('key-value-table');
    await kvt.locator('.col-key input.text-input').last().click();
    await page.keyboard.type('Bad Name');
    const error = kvt.locator('.cell-error').first();
    await expect(error).toBeVisible();
    await expect(error).toHaveAttribute('aria-label', 'Header name cannot contain spaces or newlines');
  });
});
