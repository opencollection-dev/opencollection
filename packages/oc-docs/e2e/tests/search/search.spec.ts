import { test, expect } from '../../playwright';

/**
 * The endpoint search palette: a header-anchored combobox whose listbox drops
 * below the field. Inline on desktop; revealed by a Topbar icon below desktop.
 */
test.use({ colorScheme: 'light' });

const DESKTOP = { width: 1280, height: 900 };
const TABLET = { width: 900, height: 800 };
const MOBILE = { width: 390, height: 800 };
const FIXTURE = '/?fixture=folders';

test.describe('Search palette', () => {
  test('expands in place on focus (combobox, not a dialog)', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    await expect(search.field).toBeVisible();
    await expect(search.openPanel).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await search.field.click();
    await expect(search.openPanel).toBeVisible();
    await expect(search.filters).toBeVisible();

    const box = await search.openPanel.boundingBox();
    expect(box, 'panel has no bounding box').not.toBeNull();
    expect(box?.y).toBeLessThan(80);
  });

  test('platform shortcut focuses and opens the field', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    const isMac = await page.evaluate(() => /Mac|iPhone|iPad|iPod/.test(navigator.platform));
    await page.keyboard.press(isMac ? 'Meta+k' : 'Control+k');

    await expect(search.openPanel).toBeVisible();
    await expect(search.field).toBeFocused();
  });

  test('platform shortcut refocuses the field when the panel is already open', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    const isMac = await page.evaluate(() => /Mac|iPhone|iPad|iPod/.test(navigator.platform));
    const hotkey = isMac ? 'Meta+k' : 'Control+k';

    await search.field.click();
    await expect(search.field).toBeFocused();

    await search.field.blur();
    await expect(search.field).not.toBeFocused();

    await page.keyboard.press(hotkey);
    await expect(search.field).toBeFocused();
  });

  test('shows the initial empty state before typing', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await search.field.click();

    await expect(search.panel).toContainText('Search the collection');
    await expect(search.panel).toContainText('Find any request by name, endpoint, or description.');
  });

  test('typing fuzzy-matches over request names', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(FIXTURE);
    await search.field.click();
    await search.field.fill('login');

    await expect(search.results.first()).toBeVisible();
    await expect(search.panel).toContainText('Login');
  });

  test('selecting a result navigates and closes the panel', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(FIXTURE);
    await search.field.click();
    await search.field.fill('login');
    await search.result('Login').first().click();

    await expect(search.openPanel).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Login', level: 1 })).toBeVisible();
    // focus leaves the palette after selecting, so the caret doesn't linger
    await expect(search.field).not.toBeFocused();
  });

  test('selecting a result clears the query (nothing lingers)', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(FIXTURE);
    await search.field.click();
    await search.field.fill('login');
    await search.result('Login').first().click();

    await expect(search.openPanel).toHaveCount(0);
    await search.field.click();
    await expect(search.field).toHaveValue('');
  });

  test('shows an empty state when nothing matches', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(FIXTURE);
    await search.field.click();
    await search.field.fill('zzzqqq-nomatch');

    await expect(search.panel).toContainText('No matching requests');
    await expect(search.resultsList).toHaveCount(0);
  });

  test('Escape clears and closes', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(FIXTURE);
    await search.field.click();
    await search.field.fill('login');
    await page.keyboard.press('Escape');

    await expect(search.openPanel).toHaveCount(0);
    // focus stays on the input after closing, so it's ready to type again
    await expect(search.field).toBeFocused();

    // and clicking the still-focused field reopens the panel
    await search.field.click();
    await expect(search.openPanel).toBeVisible();
  });

  test('clicking outside closes the panel', async ({ page, search, pageHeader }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');
    await search.field.click();
    await expect(search.openPanel).toBeVisible();

    await pageHeader.brandName.click();
    await expect(search.openPanel).toHaveCount(0);
  });

  test('method chip filters results to that method', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(FIXTURE);
    await search.field.click();
    await search.methodChip('GET').click();

    await expect(search.results.first()).toBeVisible();
    const count = await search.resultMethods.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(search.resultMethods.nth(i)).toHaveText('GET');
    }
  });

  test('a non-primary method chip (PATCH) filters results to that method', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(FIXTURE);
    await search.field.click();

    await search.methodChip('PATCH').click();

    await expect(search.results.first()).toBeVisible();
    const count = await search.resultMethods.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(search.resultMethods.nth(i)).toHaveText('PATCH');
    }
  });

  test('arrow-key navigation keeps the highlighted option within the scroll area', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(FIXTURE);
    await search.field.click();
    await search.methodChip('GET').click(); // enough GET results to overflow the list

    await expect(search.results.first()).toBeVisible();
    for (let i = 0; i < 12; i++) await page.keyboard.press('ArrowDown');

    await expect(search.activeOption).toBeVisible();
    const opt = await search.activeOption.boundingBox();
    const box = await search.resultsScroll.boundingBox();
    expect(opt, 'active option has no bounding box').not.toBeNull();
    expect(box, 'results scroll has no bounding box').not.toBeNull();
    // the highlighted option stays inside the visible scroll area
    expect(opt?.y).toBeGreaterThanOrEqual((box?.y ?? 0) - 1);
    expect((opt?.y ?? 0) + (opt?.height ?? 0)).toBeLessThanOrEqual((box?.y ?? 0) + (box?.height ?? 0) + 1);
  });

  test('folder dropdown closes on an outside click', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(FIXTURE);
    await search.field.click();

    await search.folderButton.click();
    await expect(search.folderMenu).toBeVisible();

    await search.field.click(); // click outside the dropdown
    await expect(search.folderMenu).toHaveCount(0);
  });

  test('folder filter scopes results to the chosen folder', async ({ page, search }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(FIXTURE);
    await search.field.click();

    await search.folderButton.click();
    await search.folderOption('Authentication').click();

    await expect(search.panel).toContainText('Login');
    await expect(search.panel).not.toContainText('Create Booking');
  });

  test('tablet: the toggle reveals a panel that stays within the viewport', async ({ page, search }) => {
    await page.setViewportSize(TABLET);
    await page.goto('/');

    await expect(search.toggleIcon).toBeVisible();
    await search.toggleIcon.click();
    await expect(search.openPanel).toBeVisible();

    const box = await search.openPanel.boundingBox();
    expect(box, 'panel has no bounding box').not.toBeNull();
    expect(box?.x).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(TABLET.width);
  });

  test('mobile: the toggle opens the panel without growing the header', async ({ page, search, pageHeader }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    const before = await pageHeader.root.boundingBox();
    expect(before, 'header has no bounding box').not.toBeNull();

    await search.toggleIcon.click();
    await expect(search.openPanel).toBeVisible();
    await expect(search.field).toBeVisible();

    const after = await pageHeader.root.boundingBox();
    expect(after, 'header has no bounding box').not.toBeNull();
    expect(after?.height).toBe(before?.height);
  });

  test('mobile: closing returns to just the toggle icon', async ({ page, search }) => {
    await page.setViewportSize(MOBILE);
    await page.goto('/');

    await search.toggleIcon.click();
    await expect(search.field).toBeVisible();

    await search.clearButton.click();
    await expect(search.field).toHaveCount(0);
    await expect(search.toggleIcon).toBeVisible();
  });
});
