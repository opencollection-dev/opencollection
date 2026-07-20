import { test, expect } from '../../playwright';

test.describe('Method select', () => {
  test.beforeEach(async ({ page, playground }) => {
    await playground.open('bottom');
    await playground.openRequest('get users');
    await expect(page).toHaveURL(/pgReq=/);
  });

  test('opens via click and exposes listbox ARIA with GET selected', async ({ methodSelect }) => {
    await methodSelect.open();
    await expect(methodSelect.surface).toBeVisible();
    await expect(methodSelect.surface.getByRole('listbox')).toBeVisible();
    await expect(methodSelect.option('GET')).toHaveAttribute('role', 'option');
    // The selected option also renders a checkmark, so match on substring.
    await expect(methodSelect.activeOption).toContainText('GET');
  });

  test('opens via Enter on the focused trigger', async ({ methodSelect }) => {
    await methodSelect.openWithKeyboard('Enter');
    await expect(methodSelect.surface).toBeVisible();
  });

  test('ArrowDown moves focus from GET to POST', async ({ methodSelect }) => {
    await methodSelect.open();
    // GET is focused on open; it also carries a checkmark, so match on substring.
    await expect(methodSelect.focusedOption).toContainText('GET');
    // Press on the focused option so keys reach the roving-focus handler.
    await methodSelect.focusedOption.press('ArrowDown');
    await expect(methodSelect.focusedOption).toHaveText('POST');
  });

  test('Enter selects an option and updates the trigger label', async ({ methodSelect }) => {
    await methodSelect.open();
    await methodSelect.focusedOption.press('ArrowDown');
    await expect(methodSelect.focusedOption).toHaveText('POST');
    await methodSelect.focusedOption.press('Enter');
    await expect(methodSelect.surface).toBeHidden();
    await expect(methodSelect.trigger).toHaveText('POST');
  });

  test('Escape closes the dropdown', async ({ methodSelect }) => {
    await methodSelect.open();
    await expect(methodSelect.surface).toBeVisible();
    await methodSelect.focusedOption.press('Escape');
    await expect(methodSelect.surface).toBeHidden();
  });

  test('offers only HTTP methods, not non-HTTP protocols', async ({ methodSelect }) => {
    const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
    const NON_HTTP_METHODS = ['GRAPHQL', 'GQL', 'GRPC', 'WEBSOCKET', 'WS'];
    const options = (await methodSelect.optionLabels()).map((o) => o.trim().toUpperCase());
    expect(options).toEqual(HTTP_METHODS);
    for (const protocol of NON_HTTP_METHODS) {
      expect(options).not.toContain(protocol);
    }
  });
});
