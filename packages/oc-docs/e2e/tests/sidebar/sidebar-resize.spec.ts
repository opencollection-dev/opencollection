import { test, expect } from '../../playwright';

const FOLDERS = '/?fixture=folders';
const DESKTOP = { width: 1280, height: 900 };

// The resize handle sits at the sidebar's right edge (left: var(--sidebar-width),
// default 260px), and the drag is delta-based from where it is grabbed, so moving
// the pointer to an absolute x lands the width near that x. Collapse fires when the
// pointer is dragged ~100px past the 200px min (i.e. below x=100); re-expand fires
// once it climbs back to the min (x>=200) within the same held gesture.

test.describe('docs sidebar - resize (desktop)', () => {
  test.use({ viewport: DESKTOP });

  test('widens when the handle is dragged right', async ({ page, sidebar }) => {
    await page.goto(FOLDERS);
    await expect(sidebar.inline).toBeVisible();
    const before = await sidebar.width();

    await sidebar.grabResizer();
    await sidebar.movePointerToX(400);
    await sidebar.releasePointer();

    const after = await sidebar.width();
    expect(after).toBeGreaterThan(before);
    expect(after).toBeGreaterThan(360);
  });

  test('clamps to the max width (480px)', async ({ page, sidebar }) => {
    await page.goto(FOLDERS);
    await sidebar.grabResizer();
    await sidebar.movePointerToX(900);
    await sidebar.releasePointer();

    const after = await sidebar.width();
    expect(after).toBeGreaterThan(470);
    expect(after).toBeLessThanOrEqual(482);
  });

  test('persists the resized width across a reload (sessionStorage)', async ({ page, sidebar }) => {
    await page.goto(FOLDERS);
    await sidebar.grabResizer();
    await sidebar.movePointerToX(380);
    await sidebar.releasePointer();
    const resized = await sidebar.width();
    expect(resized).toBeGreaterThan(360);

    await page.reload();
    await expect(sidebar.inline).toBeVisible();
    expect(Math.abs((await sidebar.width()) - resized)).toBeLessThan(5);
  });

  test('collapses when dragged past the min, and can be re-opened', async ({ page, sidebar }) => {
    await page.goto(FOLDERS);
    await sidebar.grabResizer();
    await sidebar.movePointerToX(60);
    await sidebar.releasePointer();

    await expect(sidebar.inline).toHaveCount(0);
    await expect(sidebar.expandButton).toBeVisible();

    await sidebar.expand();
    await expect(sidebar.inline).toBeVisible();
  });

  test('re-expands within the same held drag after collapsing', async ({ page, sidebar }) => {
    await page.goto(FOLDERS);
    await sidebar.grabResizer();

    await sidebar.movePointerToX(60);
    await expect(sidebar.inline).toHaveCount(0);

    await sidebar.movePointerToX(320);
    await expect(sidebar.inline).toBeVisible();

    await sidebar.releasePointer();
    await expect(sidebar.inline).toBeVisible();
  });
});

test.describe('playground sidebar - resize (bottom dock)', () => {
  test.use({ viewport: DESKTOP });

  test('widens when the handle is dragged right', async ({ playground }) => {
    await playground.open('bottom');
    await expect(playground.sidebarPanel).toBeVisible();
    const before = await playground.sidebarWidth();

    await playground.grabSidebarResizer();
    await playground.movePointerToX(400);
    await playground.releasePointer();

    expect(await playground.sidebarWidth()).toBeGreaterThan(before);
  });

  test('collapses when dragged past the min, and re-opens from the toggle', async ({ playground }) => {
    await playground.open('bottom');
    await expect(playground.sidebarPanel).toBeVisible();

    await playground.grabSidebarResizer();
    await playground.movePointerToX(60);
    await playground.releasePointer();

    await expect(playground.sidebarPanel).toHaveCount(0);

    await playground.sidebarToggle.click();
    await expect(playground.sidebarPanel).toBeVisible();
  });
});
