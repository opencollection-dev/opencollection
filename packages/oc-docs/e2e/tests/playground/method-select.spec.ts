import { test, expect } from '../../playwright';

test.describe('Method select', () => {
  test.beforeEach(async ({ page, playground }) => {
    await playground.open('bottom');
    await playground.openRequest('get users');
    await expect(page).toHaveURL(/pgReq=/);
  });

  test('opens via click and exposes listbox ARIA with GET selected', async ({ playground }) => {
    await playground.methodSelect.open();
    await expect(playground.methodSelect.surface).toBeVisible();
    await expect(playground.methodSelect.surface.getByRole('listbox')).toBeVisible();
    await expect(playground.methodSelect.option('GET')).toHaveAttribute('role', 'option');
    // The selected option also renders a checkmark, so match on substring.
    await expect(playground.methodSelect.activeOption).toContainText('GET');
  });

  test('opens via Enter on the focused trigger', async ({ playground }) => {
    await playground.methodSelect.openWithKeyboard('Enter');
    await expect(playground.methodSelect.surface).toBeVisible();
  });

  test('ArrowDown moves focus from GET to POST', async ({ playground }) => {
    await playground.methodSelect.open();
    // GET is focused on open; it also carries a checkmark, so match on substring.
    await expect(playground.methodSelect.focusedOption).toContainText('GET');
    // Press on the focused option so keys reach the roving-focus handler.
    await playground.methodSelect.focusedOption.press('ArrowDown');
    await expect(playground.methodSelect.focusedOption).toHaveText('POST');
  });

  test('Enter selects an option and updates the trigger label', async ({ playground }) => {
    await playground.methodSelect.open();
    await playground.methodSelect.focusedOption.press('ArrowDown');
    await expect(playground.methodSelect.focusedOption).toHaveText('POST');
    await playground.methodSelect.focusedOption.press('Enter');
    await expect(playground.methodSelect.surface).toBeHidden();
    await expect(playground.methodSelect.trigger).toHaveText('POST');
  });

  test('Escape closes the dropdown', async ({ playground }) => {
    await playground.methodSelect.open();
    await expect(playground.methodSelect.surface).toBeVisible();
    await playground.methodSelect.focusedOption.press('Escape');
    await expect(playground.methodSelect.surface).toBeHidden();
  });

  test('offers only HTTP methods, not non-HTTP protocols', async ({ playground }) => {
    const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
    const NON_HTTP_METHODS = ['GRAPHQL', 'GQL', 'GRPC', 'WEBSOCKET', 'WS'];
    const options = (await playground.methodSelect.optionLabels()).map((o) => o.trim().toUpperCase());
    expect(options).toEqual(HTTP_METHODS);
    for (const protocol of NON_HTTP_METHODS) {
      expect(options).not.toContain(protocol);
    }
  });
});
