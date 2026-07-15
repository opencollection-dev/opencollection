import { test, expect } from '../../playwright';

test.describe('KeyValueTable — tooltips & mobile scroll', () => {
  test.beforeEach(async ({ page, playground }) => {
    await page.goto('/#/?pg=1&dock=bottom');
    await playground.openSidebarItem('get users');
    await playground.selectTab('headers');
    await expect(playground.keyValueTable.root).toBeVisible();
  });

  test('a typed cell carries a native title tooltip with its full value', async ({ page, playground }) => {
    const { keyValueTable } = playground;
    const nameInput = keyValueTable.nameInputs.first();
    await nameInput.click();
    await page.keyboard.type('-A-Very-Long-Custom-Header-Name-That-Truncates');
    // The full value is exposed as a native title tooltip so a truncated cell stays readable.
    const value = await nameInput.inputValue();
    expect(value.length).toBeGreaterThan(0);
    await expect(nameInput).toHaveAttribute('title', value);
  });

  test('the table has a min-width and a horizontally-scrollable container', async ({ page, playground }) => {
    const { keyValueTable } = playground;
    await expect(keyValueTable.container).toHaveCSS('overflow-x', 'auto');
    await expect(keyValueTable.table).toHaveCSS('min-width', '448px'); // 28rem @16px

    // Narrow the viewport below the min-width → the container actually overflows and scrolls.
    await page.setViewportSize({ width: 360, height: 800 });
    const overflows = await keyValueTable.container.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
    expect(overflows).toBe(true);
  });

  test('offers {{variable}} autocomplete in the value cell but not the name cell', async ({ page, playground }) => {
    const { keyValueTable } = playground;
    // Value cell: a `{{` reference surfaces the collection's variables.
    await keyValueTable.valueInputs.last().click();
    await page.keyboard.type('{{coll');
    await expect(keyValueTable.autocomplete).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(keyValueTable.autocomplete).toHaveCount(0);

    // Name cell: the same reference must not open the dropdown — the app only
    // autocompletes variables in value cells, never in param/variable name cells.
    await keyValueTable.nameInputs.last().click();
    await page.keyboard.type('{{coll');
    await page.waitForTimeout(250);
    await expect(keyValueTable.autocomplete).toHaveCount(0);
  });

  test('flags a header name that contains a space with an inline error', async ({ page, playground }) => {
    const { keyValueTable } = playground;
    await keyValueTable.nameInputs.last().click();
    await page.keyboard.type('Bad Name');
    const error = keyValueTable.cellErrors.first();
    await expect(error).toBeVisible();
    await expect(error).toHaveAttribute('aria-label', 'Header name cannot contain spaces or newlines');
  });
});
