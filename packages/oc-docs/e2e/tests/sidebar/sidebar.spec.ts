import { test, expect } from '../../playwright';

const FOLDERS = '/?fixture=folders';
const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 800 };

test.describe('sidebar - desktop (inline, collapsible)', () => {
  test.use({ viewport: DESKTOP });

  test('renders inline with the overview link and a pinned footer, no hamburger or drawer', async ({ page, sidebar }) => {
    await page.goto(FOLDERS);
    await expect(sidebar.inline).toBeVisible();
    await expect(sidebar.overview).toBeVisible();
    await expect(sidebar.footer).toBeVisible();
    await expect(sidebar.footer).toContainText('Powered by');
    await expect(sidebar.hamburger).toHaveCount(0);
    await expect(sidebar.drawer).toHaveCount(0);
  });

  test('collapses the whole panel and re-opens it', async ({ page, sidebar }) => {
    await page.goto(FOLDERS);
    await sidebar.collapse();
    await expect(sidebar.inline).toHaveCount(0);
    await expect(sidebar.expandButton).toBeVisible();
    await sidebar.expand();
    await expect(sidebar.inline).toBeVisible();
  });

  test('keeps folders expanded across navigation', async ({ page, sidebar }) => {
    await page.goto(`${FOLDERS}#/bookings/lifecycle/create-booking`);
    await expect(sidebar.item('Cancel Booking')).toBeVisible();
    await sidebar.overview.click();
    await expect(page.getByTestId('page')).toHaveAttribute('data-page-type', 'overview');
    await expect(sidebar.item('Cancel Booking')).toBeVisible();
  });

  test('collapses a folder holding the active item without changing the view', async ({ page, sidebar }) => {
    await page.goto(`${FOLDERS}#/bookings/lifecycle/create-booking`);
    await expect(page.getByTestId('page')).toHaveAttribute('data-page-type', 'request');
    await expect(sidebar.folderChevron('Lifecycle')).toHaveClass(/expanded/);
    await expect(sidebar.item('Cancel Booking')).toBeVisible();

    await sidebar.toggleFolder('Lifecycle');

    await expect(sidebar.folderChevron('Lifecycle')).not.toHaveClass(/expanded/);
    await expect(sidebar.item('Cancel Booking')).toHaveCount(0);
    await expect(page.getByTestId('page')).toHaveAttribute('data-page-type', 'request');
    await expect(page).toHaveURL(/#\/bookings\/lifecycle\/create-booking$/);
  });
});

test.describe('sidebar - mobile (off-canvas drawer)', () => {
  test.use({ viewport: MOBILE });

  test('has no inline panel and opens the drawer from the hamburger', async ({ page, sidebar }) => {
    await page.goto(FOLDERS);
    await expect(sidebar.inline).toHaveCount(0);
    await expect(sidebar.backdrop).toBeHidden();
    await sidebar.openDrawer();
    await expect(sidebar.backdrop).toBeVisible();
    await expect(sidebar.drawer).toHaveAttribute('aria-hidden', 'false');
  });

  test('closes the drawer when a nav item is tapped', async ({ page, sidebar }) => {
    await page.goto(FOLDERS);
    await sidebar.openDrawer();
    await expect(sidebar.backdrop).toBeVisible();
    await sidebar.overview.click();
    await expect(sidebar.backdrop).toBeHidden();
  });

  test('closes the drawer when the backdrop is tapped', async ({ page, sidebar }) => {
    await page.goto(FOLDERS);
    await sidebar.openDrawer();
    await expect(sidebar.backdrop).toBeVisible();
    await sidebar.closeDrawerViaBackdrop();
    await expect(sidebar.backdrop).toBeHidden();
  });
});
